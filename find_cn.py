import re
import sys

files = ['lib/nihai/tianji.ts', 'lib/nihai/renji.ts', 'lib/nihai/diji.ts']
pat = re.compile('[\u4e00-\u9fff]')
for f in files:
    print('==== ' + f + ' ====')
    for i, line in enumerate(open(f, encoding='utf-8'), 1):
        if pat.search(line):
            print(i, line.rstrip())
