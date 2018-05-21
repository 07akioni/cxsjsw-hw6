import json
import os.path as path
import sqlite3

# 从文件中读取 single 数据
def get_singles_ori():
    single_file = open(path.join(path.dirname(path.abspath(__file__)), '../data/single'))
    single_str = single_file.read()
    singles = single_str.split('\n')
    singles = singles[1:]
    singles = map(lambda v: v.split('\t'), singles)
    singles = map(lambda v: { 'id': v[0], 'name': v[1], 'price': float(v[2]) }, singles)
    singles = list(singles)
    single_dict = {}
    for single in singles:
        single_dict[single['id']] = single
    return (singles, single_dict)

# 从数据库中读取 single 数据
def get_singles():
    conn = sqlite3.connect(path.join(path.dirname(path.abspath(__file__)), '../db/restaurant.db'))
    c = conn.cursor()
    sql = 'select Sid, Sname, Sprice from tbSingle;'
    c.execute(sql)
    singles = c.fetchall()
    conn.close()
    singles = map(lambda v: { 'id': v[0], 'name': v[1], 'price': float(v[2]) }, singles)
    singles = list(singles)
    single_dict = {}
    for single in singles:
        single_dict[single['id']] = single
    return (singles, single_dict)

# 从文件中读取套餐数据
def get_combos_ori():
    def convert_content(content):
        content = content.split('+')
        content = map(lambda v: v.split(','), content)
        content = map(lambda v: {
            'id': v[0],
            'count': int(v[1])
        }, content)
        return list(content)
    combo_file = open(path.join(path.dirname(path.abspath(__file__)), '../data/combo'))
    combo_str = combo_file.read()
    combos = combo_str.split('\n')
    combos = combos[1:]
    combos = map(lambda v: v.split('\t'), combos)
    combos = map(lambda v: {
        'id': v[0],
        'name': v[1],
        'price': float(v[2]),
        'content': convert_content(v[3]),
        'detail': v[4]
    }, combos)
    combos = list(combos)
    combo_dict = {}
    for combo in combos:
        combo_dict[combo['id']] = combo
    return (combos, combo_dict)

# 从数据库中读取套餐数据
def get_combos():
    conn = sqlite3.connect(path.join(path.dirname(path.abspath(__file__)), '../db/restaurant.db'))
    c = conn.cursor()
    sql = 'select Mid, Mname, Mprice from tbMulti;'
    c.execute(sql)
    combos = c.fetchall()
    sql = 'select Mid, Sid, Snum from tbMultiElement;'
    c.execute(sql)
    comboElememts = c.fetchall()
    conn.close()
    combos = map(lambda v: {
        'id': v[0],
        'name': v[1],
        'price': float(v[2]),
        'content': [],
        # 'detail': v[4]
    }, combos)
    combos = list(combos)
    for combo in combos:
        for comboElememt in comboElememts:
            if comboElememt[0] == combo['id']:
                combo['content'].append({ 'id': comboElememt[1], 'count': comboElememt[2] })
    combo_dict = {}
    for combo in combos:
        combo_dict[combo['id']] = combo
    return (combos, combo_dict)

# 读取测试信息
def get_trail_data():
    trial_file = open(path.join(path.dirname(path.abspath(__file__)), '../data/trial_data.json'))
    trial_str = trial_file.read()
    trials = json.loads(trial_str)
    trials = trials['trial']
    trials = map(lambda v: v['input'], trials)
    trials = list(trials)
    return trials

# 读取测试答案
def get_trail_res():
    trial_file = open(path.join(path.dirname(path.abspath(__file__)), '../data/trial_data.json'))
    trial_str = trial_file.read()
    trials = json.loads(trial_str)
    trials = trials['trial']
    trials = map(lambda v: v['cost'], trials)
    trials = list(trials)
    return trials