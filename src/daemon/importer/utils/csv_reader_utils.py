import os, math
import shutil

def get_temp_folder(output_path: str) -> str:
    """
    Create a temp folder in the output path

    return the temp folder path
    """
    temp_folder = os.path.join(output_path, "temp")

    if not os.path.exists(temp_folder):
        os.makedirs(temp_folder)

    return temp_folder

def clean_temp_folder(temp_folder: str) -> None:
    """
    Clean the temp folder in the output path
    """
    if os.path.exists(temp_folder):
        shutil.rmtree(temp_folder)

def split_csv_file(csv_path: str, output_folder: str, split_number: int = 10) -> [str]:
    """
    Split a csv file into multiple files

    return a list of file paths
    """
    splited_files = []
    split_percentage = 1 / split_number
    print(f"Splitting the file into {split_percentage}% parts...")
    counter = 0
    dir_path = output_folder
    csv_file_name = os.path.basename(csv_path)

    # Read Csv file
    with open(csv_path, 'r', encoding='utf-8') as csvfile:
        csvLines = csvfile.readlines()

    # Get Header and Append it to each file, unless the first one
    header = csvLines[0]
    csvLines.pop(0)

    # calculate how many splits
    total_lines = len(csvLines)
    number_splits = math.ceil(total_lines * split_percentage) # split on 10k lines 

    # Split file
    for i in range(len(csvLines)):

        # If devide all lines by the number of splits, and the rest is 0, then we have a new file
        if i % number_splits == 0:
            file_name = f'{csv_file_name}-{counter}.temp'
            write_lines = [header] + csvLines[i:i+number_splits]

            split_csv = open(os.path.join(dir_path, file_name), 'w+', encoding='utf-8')
            split_csv.writelines(write_lines)
            splited_files.append(split_csv.name)
            
            counter += 1

    return splited_files