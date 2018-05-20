from lp import price_of_order
import sys
import json

print(price_of_order(json.loads(sys.argv[1])))
