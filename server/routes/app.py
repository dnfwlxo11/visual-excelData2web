#-*-coding:utf-8

import zipfile
from tqdm import tqdm
import os 

try:
    filePath = 'uploads/'

    zipFile = zipfile.ZipFile('downloads/output.zip', 'w')

    for file in tqdm(os.listdir(filePath)):
        zipFile.write(os.path.join(filePath, file), compress_type=zipfile.ZIP_DEFLATED)

    print('zipping')
    zipFile.close()
except Exception as e:
    print(e)