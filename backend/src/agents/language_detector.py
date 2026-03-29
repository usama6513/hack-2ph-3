from langdetect import detect

def detect_language(text: str) -> str:
    """
    Detect the language of the given text.
    
    Args:
        text: The text to analyze
        
    Returns:
        Language code (e.g., 'en', 'ur', 'sd')
    """
    try:
        # Langdetect needs minimum text length
        if len(text) < 10:
            return 'en'  # Default to English for short texts
            
        detected = detect(text)
        
        # Map to our supported languages
        language_map = {
            'en': 'english',
            'ur': 'urdu',
            'sd': 'sindhi',
            'hi': 'hindi',
        }
        
        return language_map.get(detected, 'english')
    except Exception:
        return 'english'  # Default to English on error
