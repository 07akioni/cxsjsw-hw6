from pulp import *
from utils import get_singles, get_combos, get_trail_data, get_trail_res
import json
import os.path as path
import sys
import traceback

singles, single_dict = get_singles()
combos, combo_dict = get_combos()
orders = get_trail_data()

# 将菜单转化为只有单品
def convert_order_to_all_single(order):
    new_order = {}
    for key in order.keys():
        if key[0] == 'S':
            if key in new_order:
                new_order[key] += order[key]
            else:
                new_order[key] = order[key]
        if key[0] == 'M':
            combo = combo_dict[key]
            for combo_item in combo['content']:
                if combo_item['id'] in new_order:
                    new_order[combo_item['id']] += combo_item['count'] * order[key]
                else:
                    new_order[combo_item['id']] = combo_item['count'] * order[key]
    return new_order

# 得到某订单的最小价格和相应的解
def minPrice(order):
    model = pulp.LpProblem("让点菜价格最小", pulp.LpMinimize)

    single_lp_vars_dict = {}
    single_lp_vars = []
    combo_lp_vars_dict = {}
    combo_lp_vars = []

    for single in singles:
        lp_var = {
          'id': single['id'],
          'var': pulp.LpVariable(single['id'], lowBound=0, cat='Integer')
        }
        single_lp_vars_dict[single['id']] = lp_var
        single_lp_vars.append(lp_var)

    for combo in combos:
        lp_var = {
          'id': combo['id'],
          'var': pulp.LpVariable(combo['id'], lowBound=0, cat='Integer')
        }
        combo_lp_vars_dict[combo['id']] = lp_var
        combo_lp_vars.append(lp_var)

    target = 0
    for lp_var in single_lp_vars:
        target += lp_var['var'] * single_dict[lp_var['id']]['price']
    for lp_var in combo_lp_vars:
        target += lp_var['var'] * combo_dict[lp_var['id']]['price']
    model += target

    for item_key in order.keys():
        prob = 0
        prob += single_lp_vars_dict[item_key]['var']

    probs = {}
    for single in singles:
        probs[single['id']] = 0
    for lp_var in single_lp_vars:
        probs[lp_var['id']] += lp_var['var']
    for lp_var in combo_lp_vars:
        combo = combo_dict[lp_var['id']]
        for combo_item in combo['content']:
            probs[combo_item['id']] += combo_item['count'] * lp_var['var']
    for order_item_key in order.keys():
        probs[order_item_key] += (-order[order_item_key])
    for single in singles:
        probs[single['id']] = (probs[single['id']] == 0)
        model += probs[single['id']]
    try:
        model.solve()
    except Exception as e:
        pass
        # model.writeLP('errLp.lp')
    pulp.LpStatus[model.status]
    # pulp.LpStatus[model.status]

    return (pulp.value(model.objective), single_lp_vars, combo_lp_vars)

# 得到订单的原始价格
def price_of_order(order):
    price = 0
    for key in order.keys():
        if key[0] == 'M':
            price += (combo_dict[key]['price'] * order[key])
        if key[0] == 'S':
            price += (single_dict[key]['price'] * order[key])
    return price

# 从订单得到原订单、最便宜的订单、和价格
def get_dict_from_order(order):
    cost, svs, cvs = minPrice(convert_order_to_all_single(order))
    output = dict()
    for cv in cvs:
        if cv['var'].varValue != 0:
            output[cv['var'].name] = int(cv['var'].varValue)
    for sv in svs:
        if sv['var'].varValue != 0:
            output[sv['var'].name] = int(sv['var'].varValue)
    ret = dict()
    ret['cost'] = cost
    ret['input'] = order
    ret['output'] = output
    # print(cost, price_of_order(output))
    return ret

def test_trial_data():
    res = dict()
    res['trial'] = []
    for order in orders:
        res['trial'].append(get_dict_from_order(order))
    test_trial_data = open(path.join(path.dirname(path.abspath(__file__)), '../data/test_trial_data.json'), 'w')
    test_trial_data.write(json.dumps(res))
    test_trial_data.close()
    print('根据 data/trial_data.json 的 input 生成的新数据被储存在 data/test_trial_data.json')
    print('output 套餐的内容和 trial_data 可能不一样，因为有多种计算套餐的方法。但是 cost 都是一样的')

# 为订单寻找减价的套餐
# 注意，只有拿到新的菜品价格不增长才行！
def less_price_order_with_single(order, log=True):
    single_order = convert_order_to_all_single(order)
    original_order_info = get_dict_from_order(single_order)
    if log:
        print('原价:', original_order_info['cost'])
    new_min_price = sys.maxsize
    single_to_add = None
    for single in singles:
        new_order = single_order.copy()
        if single['id'] in new_order:
            new_order[single['id']] += 1
        else:
            new_order[single['id']] = 1
        try:
            order_info = get_dict_from_order(new_order)
        except Exception as e:
            if log:
                # print('出错了')
                # traceback.print_exc()
                # print(str(e))
                pass
            continue
        if order_info['cost'] <= new_min_price and order_info['cost'] <= original_order_info['cost']:
            new_min_price = order_info['cost']
            single_to_add = single['id']
        # print('增加', single['id'], '新价格:', order_info['cost'])
    if log:
        if single_to_add is not None:
            print('***增加', single_to_add, '新价格:', new_min_price)
        else:
            print('新点什么也没用了')
        print('___')
    return { 'singleToAdd': single_to_add, 'newMinPrice': new_min_price }

def test_less_price_function ():
    for order in orders:
        less_price_order_with_single(order)

if __name__ == '__main__':
    test_less_price_function()

