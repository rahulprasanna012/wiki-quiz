"""
Wikipedia Article Scraper
Fetches and cleans Wikipedia article content
"""

import requests
from bs4 import BeautifulSoup
from typing import Tuple


def scrape_wikipedia(url: str) -> Tuple[str, str]:
    """
    Scrape Wikipedia article and return cleaned content
    
    Args:
        url: Wikipedia article URL
        
    Returns:
        Tuple of (title, cleaned_content)
        
    Raises:
        Exception: If scraping fails
    """
    try:
        # Fetch the page
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract title
        title_element = soup.find(id="firstHeading")
        if not title_element:
            raise Exception("Could not find article title")
        title = title_element.get_text(strip=True)
        
        # Extract main content
        content_div = soup.find(id="mw-content-text")
        if not content_div:
            raise Exception("Could not find article content")
        
        # Get all paragraphs from main content
        paragraphs = content_div.find_all('p')
        
        # Clean and combine paragraphs
        cleaned_paragraphs = []
        for p in paragraphs:
            # Remove reference links [1], [2], etc.
            for sup in p.find_all('sup'):
                sup.decompose()
            
            # Remove edit links
            for span in p.find_all('span', class_='mw-editsection'):
                span.decompose()
            
            # Get text and strip whitespace
            text = p.get_text(strip=True)
            
            # Only include substantial paragraphs
            if len(text) > 50:
                cleaned_paragraphs.append(text)
        
        # Join all paragraphs
        cleaned_content = '\n\n'.join(cleaned_paragraphs)
        
        # Limit content length (to avoid token limits)
        max_chars = 10000
        if len(cleaned_content) > max_chars:
            cleaned_content = cleaned_content[:max_chars] + "..."
        
        if not cleaned_content:
            raise Exception("No content extracted from article")
        
        return title, cleaned_content
        
    except requests.RequestException as e:
        raise Exception(f"Failed to fetch Wikipedia page: {str(e)}")
    except Exception as e:
        raise Exception(f"Failed to scrape Wikipedia: {str(e)}")


def validate_wikipedia_url(url: str) -> bool:
    """
    Validate if URL is a Wikipedia article
    
    Args:
        url: URL to validate
        
    Returns:
        True if valid Wikipedia URL
    """
    valid_domains = [
        'wikipedia.org/wiki/',
        'en.wikipedia.org/wiki/',
        'en.m.wikipedia.org/wiki/'
    ]
    return any(domain in url for domain in valid_domains)
