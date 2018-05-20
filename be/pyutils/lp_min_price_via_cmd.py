from lp import get_dict_from_order
import sys
import json

print(json.dumps({
  'minPrice': get_dict_from_order(json.loads(sys.argv[1]))
}))
