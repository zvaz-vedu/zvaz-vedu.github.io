from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://example.com", wait_until="networkidle")
    
    # Use the correct selector for your table
    table = page.locator("table")  
    box = table.bounding_box()

    # Save screenshot of just the table
    table.screenshot(path="table.png", clip=box)
    browser.close()
