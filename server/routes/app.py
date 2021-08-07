import zipfile
from tqdm import tqdm
import os 

try:
    filePath = '../uploads2/'

    zipFile = zipfile.ZipFile('./downloads/output.zip', 'w')

    for file in tqdm(os.listdir(filePath)):
        zipFile.write(os.path.join(filePath, file), compress_type=zipfile.ZIP_DEFLATED)

    zipFile.close()
    print('asd', end='')
except Exception as e:
    print('zxc')