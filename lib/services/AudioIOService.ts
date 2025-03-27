'use strict';
'use client';
import getSpeechToken from '@/lib/actions/getSpeechToken';
import * as speechsdk from "microsoft-cognitiveservices-speech-sdk";
import { LLMRoleType, MessageItemType } from '../types/chatCompletionType';

export class AudioIOService {
    private static messageHistory: MessageItemType[] = [];
    private static readonly MAX_AUDIOCAPTURE_INACTIVITY = 15000; // 15 seconds
    private static synthesizer : speechsdk.SpeechSynthesizer | undefined = undefined
    private static stream : MediaStream | null = null
    private static audioContext : AudioContext | null = null
    private static audioPlayer : speechsdk.SpeakerAudioDestination | undefined = undefined
    private static recognizer : speechsdk.SpeechRecognizer | null = null
    private static speechConfig : speechsdk.SpeechConfig | undefined = undefined
    private static inactivityTimer: NodeJS.Timeout | undefined = undefined;
    private static isSynthesizing: boolean = false;
    private static currentAIText : string = "";
    private static currentUserText : string = "";
    private static nextSynthetizingCounterRef : number = 0;
    private static synthetizedTextsTimeout : Array<NodeJS.Timeout[]> = [];

    private static setIsStarted: (arg0: boolean) => void
    private static setIsRecognizerInitializing: (arg0: boolean) => void
    private static setInactivityDetected: (arg0: boolean) => void
    private static recognizedCallback: (text: string) => void
    private static notifyMessageHistoryChange: () => void
    



    
    /**
     * 
     * initialize everything which can be initialized which excldues the microphone stream which requires a user explicit interaction to be initialized
     */
    public static async initialize(
        setIsStarted: (arg0: boolean) => void, 
        setIsRecognizerInitializing: (arg0: boolean) => void, 
        setInactivityDetected: (arg0: boolean) => void,
        recognizedCallback: (text: string) => void,
        notifyMessageHistoryChange: () => void)
        {
        try {
            await AudioIOService.initializeSpeechConfig();
            await AudioIOService.initializeTextToSpeech();
            AudioIOService.setIsStarted = setIsStarted.bind(this);
            AudioIOService.setIsRecognizerInitializing = setIsRecognizerInitializing.bind(this);
            AudioIOService.setInactivityDetected = setInactivityDetected.bind(this);
            AudioIOService.recognizedCallback = recognizedCallback.bind(this);
            AudioIOService.notifyMessageHistoryChange = notifyMessageHistoryChange.bind(this)
            console.log('AudioIO initialized');
        } catch (err) {
            console.error('Error initializing AudioIO', err);
            return null;
        }
    }

    public static getMessagesHistory = () => {
        return AudioIOService.messageHistory;
    }

    /**
     * 
     */
    public static startAudioCaptureAndSpeechRecognition = async (languageCode: string = 'en-US') => {
        try {
            if (!AudioIOService.speechConfig) {
                throw new Error('Speech config not initialized. Need to call initializeSpeechConfig() first.');
            }
            AudioIOService.setIsRecognizerInitializing(true);
            AudioIOService.setInactivityDetected(false);
            await AudioIOService.initializeMicrophoneStream();
            AudioIOService.speechConfig!.speechRecognitionLanguage = languageCode;
            const audioConfig = speechsdk.AudioConfig.fromStreamInput(AudioIOService.stream!);
            AudioIOService.recognizer = new speechsdk.SpeechRecognizer(AudioIOService.speechConfig!, audioConfig);
            
            AudioIOService.recognizer.speechStartDetected = (s, e) => {
                console.log('Speech started');
            }
    
            AudioIOService.recognizer.recognized = async (s, e) => {    
                if (e.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
                    AudioIOService.pushCurrentRecognizedTextInCurrentUserText(e.result.text);
                    AudioIOService.currentUserText = "";
                    AudioIOService.recognizedCallback(e.result.text)
                }
                else if (e.result.reason === speechsdk.ResultReason.NoMatch) {
                    console.log("NOMATCH: Speech could not be recognized.");
                }
            }
            
            AudioIOService.recognizer.recognizing = (s, e) => {
                AudioIOService.interruptSynthetizerIfSynthetizingIsInProgress();
                AudioIOService.pushCurrentRecognizedTextInCurrentUserText(e.result.text);
                AudioIOService.resetInactivityTimer();
            };
    
            AudioIOService.recognizer.startContinuousRecognitionAsync(
                () => {
                  console.log('Recognition started'),
                  AudioIOService.setIsRecognizerInitializing(false);
                  AudioIOService.setIsStarted(true);
            
                },
                err => {
                  console.log(`ERROR: ${err}`)
                  AudioIOService.setIsRecognizerInitializing(false);
              });
        }
        catch (err) {
            console.error('Error starting audio capture and speech recognition', err);
        }
    }

    /**
     * 
     * 
     */
    public static stopAudioCaptureAndSpeechRecognition = async () => {
        if (AudioIOService.stream) {
            AudioIOService.stream.getTracks().forEach(track => track.stop());
        }
        if (AudioIOService.audioContext) {
            AudioIOService.audioContext.close();
        }
        if (AudioIOService.recognizer) {
            AudioIOService.recognizer.stopContinuousRecognitionAsync();
        }
      }
    
    /**
     * 
     * 
     */
    public static textToSpeech = async (textToSpeak: string) => {
        if (!AudioIOService.synthesizer) {
            throw new Error('Synthesizer not initialized. Need to call initializeTextToSpeech() first.');
        }
        AudioIOService.stopInactivityTimer();
        AudioIOService.synthetizedTextsTimeout[AudioIOService.nextSynthetizingCounterRef] = [];
        AudioIOService.currentAIText = "";
        AudioIOService.isSynthesizing = true;      
        AudioIOService.synthesizer!.speakTextAsync(
        textToSpeak,
        (result) => {
            if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
                AudioIOService.nextSynthetizingCounterRef++;              
                // to detect when ai has finished speaking
                setTimeout(() => {
                    AudioIOService.isSynthesizing = false;  
                    AudioIOService.resetInactivityTimer();
                  }, result.audioDuration / 10000); // Convert to milliseconds
            } else if (result.reason === speechsdk.ResultReason.Canceled) {
                console.log(`synthesis failed. Error detail: ${result.errorDetails}.\n`);
                AudioIOService.isSynthesizing = false; 
                AudioIOService.resetInactivityTimer();
            }
        },
        (err) => {
            console.error(err);
            AudioIOService.isSynthesizing = false;  
            AudioIOService.resetInactivityTimer();
        });
    }


    /*
    ******************PRIVATE METHODS***************
    */
    private static initializeSpeechConfig = async () => {
        const tokenObj = await getSpeechToken();
        if (!tokenObj) {
            throw  new Error('There was an error authorizing your speech key.');
        }
        AudioIOService.speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
    }

    private static async initializeMicrophoneStream() : Promise<void> {
        const constraints = {
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        };
        AudioIOService.stream = await navigator.mediaDevices.getUserMedia(constraints);
    }

    private static async initializeTextToSpeech () {
        if (!AudioIOService.speechConfig) {
            throw new Error('Speech config not initialized. Need to call initializeSpeechConfig() first.');
        }
        AudioIOService.audioPlayer = new speechsdk.SpeakerAudioDestination();
        const audioConfig = speechsdk.AudioConfig.fromSpeakerOutput(AudioIOService.audioPlayer);

        AudioIOService.synthesizer = new speechsdk.SpeechSynthesizer(AudioIOService.speechConfig, audioConfig);

        // this is to display the text being spoken
        AudioIOService.synthesizer.wordBoundary = (s, e) => {
            this.displayTextBeingSynthetized(e.text, e.audioOffset);
        }
    }

    
private static cancelDisplayOfTextBeingSynthetized = () => {
    for (const wordBoundaryTimeout of AudioIOService.synthetizedTextsTimeout[AudioIOService.nextSynthetizingCounterRef - 1]) {
        clearTimeout(wordBoundaryTimeout);
    }
}

private static displayTextBeingSynthetized = (text: string, audioOffset: number) => {
    const wordBoundaryTimeout = setTimeout(() => {
      AudioIOService.pushWordInCurrentAIText(text);
    }, audioOffset / 10000); // Convert to milliseconds
    AudioIOService.synthetizedTextsTimeout[AudioIOService.nextSynthetizingCounterRef].push(wordBoundaryTimeout);
};



private static resetInactivityTimer = () => {
    AudioIOService.stopInactivityTimer();
    AudioIOService.inactivityTimer = setTimeout(() => {
        AudioIOService.setInactivityDetected(true)
        AudioIOService.stopAudioCaptureAndSpeechRecognition();
    }, AudioIOService.MAX_AUDIOCAPTURE_INACTIVITY); // 15 seconds
};
private static stopInactivityTimer = () => {
    console.log('stopping inactivity timer')
    console.log(AudioIOService.inactivityTimer)
    if (AudioIOService.inactivityTimer) {
        clearTimeout(AudioIOService.inactivityTimer);
        console.log(AudioIOService.inactivityTimer)
    }
};

private static  pushCurrentRecognizedTextInCurrentUserText = (currentTextRecognized: string) => {
    const firstWord = AudioIOService.currentUserText.length === 0;
    AudioIOService.currentUserText = currentTextRecognized;
    if (!firstWord) {
        // delete the last item of the messageHistory as the provied argument currentTextRecognized already contains it
        AudioIOService.messageHistory = AudioIOService.messageHistory.slice(0, -1);
    }
    AudioIOService.pushToMessageHistory({content: currentTextRecognized, role: LLMRoleType.User});
}

private static pushWordInCurrentAIText = (word: string) => {
    const firstWord = AudioIOService.currentAIText.length === 0;
    AudioIOService.currentAIText += " "+word;
    if (!firstWord) {
      // delete the last item of the messageHistory (to avoid mutation of the array)
      AudioIOService.messageHistory = AudioIOService.messageHistory.slice(0, -1);
    }
    AudioIOService.pushToMessageHistory({content: AudioIOService.currentAIText, role: LLMRoleType.Assistant});
}

private static pushToMessageHistory = (messageItem: MessageItemType) => {
    AudioIOService.messageHistory.push({ ...messageItem });
    // nextDialogIndexRef.current = _messageHistory.current.length
    AudioIOService.notifyMessageHistoryChange();
  };


private static interruptSynthetizerIfSynthetizingIsInProgress = () => {
    console.log(AudioIOService.isSynthesizing)
    if (AudioIOService.isSynthesizing) {
      console.log('User is speaking while synthesizing in progress. Stopping it.');
      // this is the only I found to interrupt the audio as the speech sdk does not provide a stop/cancel method
      AudioIOService.audioPlayer?.mute()
      AudioIOService.cancelDisplayOfTextBeingSynthetized();
      AudioIOService.audioPlayer?.close();
      // stop displaying the text being spoken
      AudioIOService.initializeTextToSpeech();
    }

}


}