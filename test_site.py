import asyncio
from playwright.async_api import async_playwright
import urllib.request
import sys

def check_port(port):
    try:
        urllib.request.urlopen(f'http://localhost:{port}/', timeout=2)
        return True
    except:
        return False

async def main():
    port = 1313
    if not check_port(port):
        port = 64376
        if not check_port(port):
            print("Hugo is not running on 1313 or 64376")
            return
            
    base_url = f"http://localhost:{port}"
    print(f"Testing on {base_url}")
    
    pages_to_test = [
        '/',
        '/o-nas/',
        '/praha/',
        '/brno/',
        '/plzen/',
        '/plzen/plzen24/'
    ]
    
    results = []
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        for path in pages_to_test:
            url = base_url + path
            print(f"Visiting {url}")
            
            failed_resources = []
            def on_response(response):
                if response.status >= 400:
                    failed_resources.append((response.url, response.status))
                    
            page.on("response", on_response)
            
            try:
                await page.goto(url, wait_until='networkidle')
            except Exception as e:
                print(f"Error visiting {url}: {e}")
                continue
                
            page.remove_listener("response", on_response)
            
            results.append({
                'url': url,
                'failed_resources': failed_resources
            })
            
        await browser.close()
        
    for res in results:
        print(f"\nResults for {res['url']}:")
        if not res['failed_resources']:
            print("  All resources loaded successfully.")
        else:
            for r_url, status in res['failed_resources']:
                print(f"  Failed: {r_url} (Status: {status})")

if __name__ == "__main__":
    asyncio.run(main())
