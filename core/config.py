# import os
# from dotenv import load_dotenv
# import json
# from pathlib import Path

# # Load environment variables from the .env file
# BASE_DIR = Path(__file__).resolve().parent.parent
# load_dotenv(BASE_DIR / '.env')

# class DatabaseConfig:
#     """Database configuration class to load settings from environment variables."""
#     ENGINE = os.getenv('DB_ENGINE', 'django.db.backends.mysql')
#     NAME = os.getenv('DB_NAME', BASE_DIR / 'db.sqlite3')
#     USER = os.getenv('DB_USER', '')
#     PASSWORD = os.getenv('DB_PASSWORD', '')
#     HOST = os.getenv('DB_HOST', 'localhost')
#     PORT = os.getenv('DB_PORT', '3306')
#     OPTIONS = json.loads(os.getenv('DB_OPTIONS', '{}'))

#     @classmethod
#     def as_dict(cls):
#         """Return the database configuration as a dictionary."""
#         return {
#             'ENGINE': cls.ENGINE,
#             'NAME': cls.NAME,
#             'USER': cls.USER,
#             'PASSWORD': cls.PASSWORD,
#             'HOST': cls.HOST,
#             'PORT': cls.PORT,
#             'OPTIONS': cls.OPTIONS,
#         }