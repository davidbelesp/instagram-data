from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup

import dotenv
import time
import random
import sqlite3
import os

# env

dotenv.load_dotenv()
config = dotenv.dotenv_values('.env')

USERNAME = config['INSTAGRAM_USERNAME']
os.makedirs('data', exist_ok=True)

# Profile data model

class Profile():

    def __init__(self, username, post_count, followers_count, following_count, profile_image_url, timestamp):
        self.username = username
        self.post_count = post_count
        self.followers_count = followers_count
        self.following_count = following_count
        self.profile_image_url = profile_image_url
        self.timestamp = timestamp
        self.follower_ratio = self.followers_to_following_ratio()

    def followers_to_following_ratio(self):
        return int(self.followers_count) / int(self.following_count)
    
    def __str__(self):
        return f"Username: {self.username}\nPost Count: {self.post_count}\nFollowers Count: {self.followers_count}\nFollowing Count: {self.following_count}\nProfile Image URL: {self.profile_image_url}\nFollowers to Following Ratio: {self.followers_to_following_ratio()}"

# SQLITE DB

connection = sqlite3.connect('data/profiledata.db')
cursor = connection.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS profiles (
        username TEXT,
        post_count INTEGER,
        followers_count INTEGER,
        following_count INTEGER,
        profile_image_url TEXT,
        follower_ratio REAL,
        timestamp INTEGER
    )
''')

# Util functions 

def get_current_date():
    return round(time.time()*1000)

def insert_into_db(profile):
    cursor.execute('''
        INSERT INTO profiles (username, post_count, followers_count, following_count, profile_image_url, follower_ratio, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (profile.username, profile.post_count, profile.followers_count, profile.following_count, profile.profile_image_url, profile.follower_ratio, profile.timestamp))
    connection.commit()

# setting driver

chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-gpu')

driver = webdriver.Chrome(options=chrome_options)

url = f'https://www.instagram.com/{USERNAME}/'
driver.get(url)

# Main logic

def get_and_save_data():
    try:
        # Additional delay to ensure all dynamic content is loaded
        time.sleep(random.uniform(3.0, 5.0))

        # Get the page source after the dynamic content has loaded
        page_content = driver.page_source

        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(page_content, 'html.parser')

        # Find the required elements using BeautifulSoup
        list_items = soup.find_all('li', class_='xl565be x1m39q7l x1uw6ca5 x2pgyrj')
        metadata = soup.find_all('meta') #TODO: get profile image url & bio

        post_count = list_items[0].find('span', class_='html-span').get_text()
        followers_count = list_items[1].find('span', class_='_ac2a')['title'].replace(',', '').replace('.', '')
        following_count = list_items[2].find('span', class_='html-span').get_text()

        profile = Profile(USERNAME, post_count, followers_count, following_count, None, get_current_date())

        # Insert into DB
        insert_into_db(profile)

        # write last profile data page loaded
        with open('data/lastoutput.html', 'w', encoding='utf-8') as file:
            file.write(str(soup.prettify()))

        print("HTML content has been written to 'lastoutput.html'")
    finally:
        # Close the WebDriver and connections
        driver.quit()
        connection.close()

if __name__ == '__main__':
    get_and_save_data()
