import os
import base64
from fontTools.ttLib import TTFont

def convert_to_woff2(input_file, output_file):
    try:
        # Load the font file
        font = TTFont(input_file)
        
        # Save as WOFF2
        font.save(output_file, flavor="woff2")
        print(f"Successfully converted '{input_file}' to '{output_file}'")
    except Exception as e:
        print(f"Error converting '{input_file}' to WOFF2: {e}")

def main():
    # Base64 input file containing the font
    base64_file = "advocate_c41_base64.txt"  # Change this to your base64 file name
    
    # Read and decode the base64 content
    with open(base64_file, "r") as f:
        base64_content = f.read()
    font_data = base64.b64decode(base64_content)
    
    # Save the decoded font to a temporary file
    temp_font_file = "temp_font.ttf"
    with open(temp_font_file, "wb") as f:
        f.write(font_data)
    
    # Output WOFF2 file
    output_file = os.path.splitext(temp_font_file)[0] + ".woff2"
    
    # Convert the font
    convert_to_woff2(temp_font_file, output_file)
    
    # Clean up the temporary file
    os.remove(temp_font_file)

if __name__ == "__main__":
    main()