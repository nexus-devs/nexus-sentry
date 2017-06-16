# Main Functions
# ----------------------
import Request
import screen # for OCR

# Connections
# ----------------------
from blitz_js_query import Blitz
import ast

# Misc
# ----------------------
import datetime
import calendar
import time


#
class NexusSentry:

    def __init__(self):
        self.requestCache = []
        self.apiClient = Blitz({
            'api_url': 'https://api.nexus-stats.com',
            'auth_url': 'https://auth.nexus-stats.com'
        })

        # Get items from nexus-stats and refresh every minute
        self.getItemList()


    def getItemList(self):
