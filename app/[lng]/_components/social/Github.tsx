import Link from "next/link";

export type EventProps = Event;


export default function SocialIconGithub({ githubProfileUrl} : {githubProfileUrl: string}) {


    return (
        <Link href={githubProfileUrl}className="text-gray-200">
            <svg 
                className="fill-current text-gray-400 hover:text-blue-600 transition-colors duration-150"
                width="20" 
                height="20"
                viewBox="0 0 24 24"
            >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
        </Link>
    );

}

