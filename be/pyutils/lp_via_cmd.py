from lp import get_dict_from_order, less_price_order_with_single
import sys
import json

print(json.dumps({
  'minPrice': get_dict_from_order(json.loads(sys.argv[1])),
  'lessPrice': less_price_order_with_single(json.loads(sys.argv[1]), False)
}))
