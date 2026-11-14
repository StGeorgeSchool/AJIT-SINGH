export const PROJECT_METADATA = {
  schoolName: 'St. George Co-Ed Sr. Sec School',
  studentName: 'Priyansh Dadariya',
  projectTitle: 'Online Voting System',
  subtitle: 'A Menu-Driven Python & MySQL Electoral Management Application',
  fileName: 'online_voting_system_e2f14e45.py',
  downloadUrl: '/assets/aistudio/online_voting_system_e2f14e45.py',
  databaseName: 'online_voting_system',
  language: 'Python 3',
  databaseEngine: 'MySQL (mysql.connector)',
  libraries: ['datetime', 'random', 'tabulate', 'mysql.connector'],
  academicYear: '2026–27',
} as const;

export const PYTHON_SOURCE_CODE = `import datetime
import random
from tabulate import tabulate
import mysql.connector as conn

c = conn.connect(
    host="localhost",
    user="root",
    password="admin",
    auth_plugin='mysql_native_password',
    database="online_voting_system"
)
cursor=c.cursor(buffered=True)

def admin_password():
    cursor.execute("select * from admin")
    A = cursor.fetchone()
    ADMIN_PASSWORD=A[0]
    return ADMIN_PASSWORD

def BLOCK():
    #stores all consistuencies.
    global b
    b = []
    cursor.execute("select * from block")
    B = cursor.fetchall()
    for i in B:
        b.append(i[0])

def REGISTER_VOTER():
    c = conn.connect(
        host="localhost",
        user="root",
        password="admin",
        auth_plugin='mysql_native_password',
        database="online_voting_system"
    )
    cursor=c.cursor(buffered=True)
    print("\\n--- Voter Registration ---")
    print("\\n...")
    elector_name=input("Enter your name: ").strip().title()
    father_name=input("Enter your father name: ").strip().title()
    while True:
        block=input("Enter your consistuency: ").strip().title()
        BLOCK()
        #checks if consistuency is valid.
        if block not in b:
            print("________________________________")
            print("\\nInvalid consistuency. Try again.")
            print("--------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        break
    while True:
        try:
            mobile_no=int(input("Enter your mobile no. : "))
            if len(str(mobile_no))>10 or len(str(mobile_no))<10:
                print("________________________________")
                print("\\nInvalid number (no. should be of 10 digits). Try again.")
                print("--------------------------------")
                d = input("Enter '0' to exit or anything else to continue: ")
                if d == '0':
                    return
                else:
                    continue
        except:
            print("________________________________")
            print("\\nInvalid input. Try again.")
            print("--------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        cursor.execute("select * from voters where mobile_no={}".format(mobile_no))
        data=cursor.fetchall()
        if data != []:
            print("________________________________")
            print("\\nInvalid mobile number. Try again.")
            print("--------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        break
    while True:
        DOB=input("Enter date of birth as (YYYY-MM-DD): ")
        try:
            date = datetime.datetime.strptime(DOB,"%Y-%m-%d")
            now=datetime.datetime.today()
            year1=now.year
            year2=date.year
            eighteen_year= year1-year2
            if eighteen_year<18:
                print("________________________________")
                print("\\nYou are underage,must be 18 or above to vote.")
                print("--------------------------------")
                return
        except:
            print("________________________________")
            print("\\nInvalid input fill date as (YYYY-MM-DD)hypen not negotiable.")
            print("--------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        break
    while True:
        email_id=input("Enter email id as (abc456@gmail.com): ")
        a = email_id.partition("@")
        if a[1]!="@" or a[2]!="gmail.com":
            print("________________________________")
            print("\\nEnter valid email id as(abc456@gmail.com)")
            print("--------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        cursor.execute("select * from voters where email_id='{}'".format(email_id))
        data2=cursor.fetchall()
        if data2 != []:
            print("________________________________")
            print("\\nInvalid email. Try again.")
            print("--------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        break
    while True:
        password=input("Set a password: ")
        cursor.execute("select * from voters where password='{}'".format(password))
        data3=cursor.fetchall()
        if data3 != []:
            print("________________________________")
            print("\\nInvalid password. Try again.")
            print("--------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        confrim_password=input("Enter the password again: ")
        if password != confrim_password:
            print("________________________________")
            print("\\nPlease enter the password same as entered before")
            print("--------------------------------")
            continue
        break
    print("\\nWARNING: The details you filled are permanent. You cannot change it later.")
    pick=input("\\nEnter y/Y to continue or Enter anything else to return: ")
    if pick in ["y","Y"]:
        #Generates a new voter ID.
        print("\\n- Generating voter ID please wait -")
        while True:
            voter_id=random.randint(1000000000,9999999999)
            cursor.execute("SELECT voter_id FROM voters")
            results=cursor.fetchall()
            v_id=[]
            for i in results:
                v_id.append(i[0])
            if voter_id not in v_id:
                break
        print("The voter id sanctioned to you – ",voter_id)
        cursor.execute("insert into voters values({},'{}','{}','{}',{},'{}','{}','{}',{})".format(voter_id,elector_name,father_name,DOB,mobile_no,email_id,password,block,0))
        c.commit()
        print("\\nYou have registered successfully.")
        print("Start voting through the online_voting_system and immortalize the democracy by alligning it with digital platforms.")
        print("...")
    else:
        return
    c.commit()
    cursor.close()
    c.close()

def view_results():
    c = conn.connect(
        host="localhost",
        user="root",
        password="admin",
        auth_plugin='mysql_native_password',
        database="online_voting_system"
    )
    cursor=c.cursor(buffered=True)
    while True:
        print("\\n---------------------------------")
        print("Choose 1 to view the votes given to a individual candidate of particular block.")
        print("Choose 2 to view the votes given to all candidates of a particular block.")
        print("Choose 4 to view the final results.")
        print("Choose 5 to exit.")
        print("---------------------------------")
        try:
            choice = int(input("Enter your choice: "))
            if choice not in [1, 2, 4, 5]:
                print("________________________________")
                print("No such choice are given please select from above only.")
                print("--------------------------------")
                continue
        except:
            print("________________________________")
            print("Enter your choice from above only.")
            print("--------------------------------")
            continue
        if choice == 1:
            try:
                candidate_id = int(input("\\nCandidate's ID - "))
                cursor.execute("select * from candidates where candidate_id={}".format(candidate_id))
            except:
                print("________________________________")
                print("Invalid input.")
                print("--------------------------------")
            data = cursor.fetchall()
            if data != []:
                print("________________________________")
                print("\\nCandidate name – ", data[0][1])
                print("Consistuency – ", data[0][3])
                print("Party - ", data[0][2])
                print("Total Votes - ", data[0][4])
                print("________________________________")
            else:
                print("________________________________")
                print("No such candidate ID exist.")
                print("--------------------------------")
        elif choice == 2:
            block = input("Enter the Consistuency: ")
            cursor.execute("select * from candidates where block='{}'".format(block))
            data2 = cursor.fetchall()
            if data2 != []:
                for i in data2:
                    print("\\nCandidate ID – ", i[0])
                    print("Candidate Name - ", i[1])
                    print("Party - ", i[2])
                    print("Total Votes - ", i[4])
                    print("________________________________")
            else:
                print("________________________________")
                print("No such Consistuency exists.")
                print("--------------------------------")
        elif choice == 4:
            BLOCK()
            final_result = []
            for block in b:
                cursor.execute("SELECT candidate_id, candidate_name, votes, party_name, block FROM candidates WHERE block = %s ORDER BY votes DESC", (block,))
                results = cursor.fetchall()
                if results==[]:
                    continue
                print(f"\\nIn {block} block:")
                max_votes = results[0][2]
                for r in results:
                    if r[2] == max_votes:
                        final_result.append(r)
                        print(f"{r[1]} won with {r[2]} votes ({r[3]})")
                    else:
                        break
            #Display result in a table.
            print("\\n====== FINAL RESULTS ======")
            headers = ["Candidate ID", "Candidate Name", "Votes", "Party", "Block"]
            print(tabulate(final_result, headers, tablefmt="fancy_grid"))
        elif choice == 5:
            break
        else:
            print("________________________________")
            print("Invalid Choice.")
            print("--------------------------------")
    c.commit()
    cursor.close()
    c.close()

def view_registered_voters():
    c = conn.connect(
        host="localhost",
        user="root",
        password="admin",
        auth_plugin='mysql_native_password',
        database="online_voting_system"
    )
    cursor=c.cursor(buffered=True)
    print("\\n--- Registered Voters ---")
    BLOCK()
    cursor.execute("SELECT * FROM voters")
    data=cursor.fetchall()
    if data==[]:
        print("________________________________")
        print("\\nNo registered voters.")
        print("--------------------------------")
        return
    print(" ")
    cm = 1
    for w in b:
        print(f"{cm}. {w}")
        cm=cm+1
    print(f"{cm}. All Consistuency")
    while True:
        try:
            b_choice=int(input("\\nPlease choose the consistuency of voters you want to see : "))
        except:
            print("________________________________")
            print("Invalid Input.")
            print("--------------------------------")
            continue
        if (b_choice>cm) or (b_choice<1):
            print("________________________________")
            print("Invalid choice. Try again")
            print("--------------------------------")
            continue
        #Show voters of all consistuency.
        if b_choice==cm:
            headers = ["Voter ID", "Name","Father's Name","Date of Birth"," Mobile Number","E-mail address","password","block","voted"]
            print(tabulate(data, headers=headers, tablefmt="psql"))
            print("\\nYour voice matters. Your vote counts.")
            break
        #Show voters of chosen consistuency.
        Block=b[b_choice-1]
        cursor.execute("SELECT * FROM voters where block=%s", (Block,))
        result=cursor.fetchall()
        headers = ["Voter ID", "Name","Father's Name","Date of Birth"," Mobile Number", "E-mail address","password","block","voted"]
        print(tabulate(result, headers=headers, tablefmt="psql"))
        print("\\nYour voice matters. Your vote counts.")
        break
    c.commit()
    cursor.close()
    c.close()

def add_candidate():
    c = conn.connect(
        host="localhost",
        user="root",
        password="admin",
        auth_plugin='mysql_native_password',
        database="online_voting_system"
    )
    cursor=c.cursor(buffered=True)
    name=input("Enter candidate name: ").strip().title()
    while True:
        block=input("Enter the consistuency: ").strip().title()
        BLOCK()
        if block not in b:
            print("________________________________")
            print("\\nInvalid consistuency. Try again.")
            print("--------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        break
    party_name=input("Enter Party name: ").strip().upper()
    cursor.execute(f"SELECT party_name FROM candidates where block='{block}'")
    results=cursor.fetchall()
    for r in results:
        if party_name==r[0]:
            print("________________________________")
            print(f"\\n{party_name} is already a party in {block}.")
            print("--------------------------------")
            return
    print("\\nWARNING: The details you filled are permanent. You cannot change it later.")
    pick=input("\\nEnter y/Y to continue or Enter anything else to return: ")
    if pick in ["y","Y"]:
        #Generates candidate ID.
        while True:
            candidate_id=random.randint(101,999)
            cursor.execute("SELECT candidate_id FROM candidates")
            results=cursor.fetchall()
            c_id = []
            for w in results:
                c_id.append(w[0])
            if candidate_id not in c_id:
                break
        cursor.execute(f"INSERT INTO candidates VALUES({candidate_id},'{name}','{party_name}', '{block}',0)")
        c.commit()
        print(f"\\nCandidate ID - {candidate_id}")
        print(f"Party name - {party_name}")
        print(f"Block - {block}")
        print(f"\\nCandidate '{name}' added successfully.")
    else:
        return
    c.commit()
    cursor.close()
    c.close()

def view_candidates():
    c = conn.connect(
        host="localhost",
        user="root",
        password="admin",
        auth_plugin='mysql_native_password',
        database="online_voting_system"
    )
    cursor=c.cursor(buffered=True)
    cursor.execute("SELECT c.candidate_id,c.candidate_name,c.party_name,c.block FROM candidates c INNER JOIN block b ON c.block = b.block_name")
    result=cursor.fetchall()
    header= ["Candidate ID", "Candidate Name","Party Name","Block"]
    print()
    print(tabulate(result, headers=header, tablefmt="fancy_grid"))
    c.commit()
    cursor.close()
    c.close()

def ADMIN_MENU():
    c = conn.connect(
        host="localhost",
        user="root",
        password="admin",
        auth_plugin='mysql_native_password',
        database="online_voting_system"
    )
    cursor=c.cursor(buffered=True)
    while True:
        print("\\n--- Admin Menu ---")
        print("1. Add Candidate")
        print("2. View Results")
        print("3. View Registered Voters")
        print("4. View Registered Candidates")
        print("5. Exit to Main Menu")
        choice = input("Enter your choice: ")
        if choice == '1':
            add_candidate()
        elif choice == '2':
            view_results()
        elif choice == '3':
            print("\\n--------------------------------")
            print("Choose 1 to see the number of voters from each Consistuency.")
            print("Choose 2 to see the registered voters.")
            print("Choose 3 to see the names of voters with their title -")
            print("--------------------------------")
            choose2=input("Enter your choice: ")
            if choose2 == "1":
                cursor.execute("select block, count(*) as voted_count from voters group by block having voted_count > 0")
                r = cursor.fetchall()
                print()
                for w in r:
                    print(f"{w[0]} - {w[1]}")
            elif choose2 == "2":
                view_registered_voters()
            elif choose2 == "3":
                print()
                a = input("Enter the title of voters you want to see: ")
                cursor.execute("select voter_name,voter_id from voters where voter_name like %s", (f"%{a}",))
                print()
                R = cursor.fetchall()
                for w in R:
                    print(w[0]," - ",w[1])
            else:
                print("________________________________")
                print("\\nInvalid choice. Try again.")
                print("--------------------------------")
        elif choice == '4':
            view_candidates()
        elif choice == '5':
            break
        else:
            print("________________________________")
            print("\\nInvalid choice. Try again.")
            print("--------------------------------")
    c.commit()
    cursor.close()
    c.close()

def show_candidates():
    c = conn.connect(
        host="localhost",
        user="root",
        password="admin",
        auth_plugin='mysql_native_password',
        database="online_voting_system"
    )
    cursor=c.cursor(buffered=True)
    #Display available candidates.
    print("\\nAvailable Candidates:")
    s = profile_details[7]
    cursor.execute(f"SELECT * FROM candidates WHERE block='{s}'")
    candidates = cursor.fetchall()
    if candidates==[]:
        print("No candidates are available in your Consistuency.")
        return
    for c in candidates:
        print(f"{c[0]} - {c[1]}")
    return 1
    c.commit()
    cursor.close()
    c.close()

def VOTER_MENU():
    c = conn.connect(
        host="localhost",
        user="root",
        password="admin",
        auth_plugin='mysql_native_password',
        database="online_voting_system"
    )
    cursor=c.cursor(buffered=True)
    print("\\n---Voter Menu---")
    while True:
        try:
            voter_id = int(input("Enter your Voter ID: "))
        except:
            print("________________________________")
            print("\\nInvalid Voter ID. Try again.")
            print("--------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        # Check if voter exists
        if profile_details[0] != voter_id:
            print("________________________________")
            print("\\nIncorrect Voter ID. Try again.")
            print("--------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        cursor.execute(f"SELECT has_voted FROM voters WHERE voter_id={voter_id}")
        result=cursor.fetchone()
        if result is None:
            print("________________________________")
            print("\\nVoter ID not found. Please check your Voter ID and try again.")
            print("--------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        if result[0]:
            print("________________________________")
            print("\\nYou have already voted. Multiple votes are not allowed.")
            print("--------------------------------")
            return
        break
    while True:
        dob_str=input("Enter your date of birth (YYYY-MM-DD): ")
        try:
            dob=datetime.datetime.strptime(dob_str,"%Y-%m-%d").date()
        except ValueError:
            print("________________________________")
            print("\\nInvalid format! Please use YYYY-MM-DD")
            print("--------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        today=datetime.date.today()
        y = today.year-18
        m = today.month
        d = today.day
        eighteen_year_ago=datetime.date(y,m,d)
        cursor.execute(f"SELECT dob FROM voters WHERE voter_id={voter_id}")
        date_of_birth=cursor.fetchone()
        if eighteen_year_ago<date_of_birth[0]:
            print("________________________________")
            print("\\nYou are underage. Must be 18 or above to vote.")
            print("--------------------------------")
            return
        if dob != date_of_birth[0]:
            print("________________________________")
            print("---------------------------------")
            print("\\nIncorrect Date Of Birth. Try again.")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        break
    #Checks if candidates are available.
    x = show_candidates()
    if x is None:
        return
    cursor.execute(f"SELECT voter_name FROM voters WHERE voter_id={voter_id}")
    z = cursor.fetchone()
    while True:
        try:
            candidate_id = int(input("\\nEnter the candidate ID you want to vote for: "))
            cursor.execute("select candidate_id from candidates where candidate_id=%s",(candidate_id,))
            result=cursor.fetchone()
            if result is None:
                print("________________________________")
                print("Invalid candidate ID.Try again.")
                print("--------------------------------")
                d = input("Enter '0' to exit or anything else to continue: ")
                if d == '0':
                    return
                else:
                    continue
            # Update vote count
            cursor.execute(f"UPDATE candidates SET votes=votes+1 WHERE candidate_id={candidate_id}")
            # Mark voter as voted
            cursor.execute(f"UPDATE voters SET has_voted=TRUE WHERE voter_id={voter_id}")
            c.commit()
            print(f"\\n{z[0]} has voted succesfully.")
            print("Your vote has been recorded. Thank you for voting!")
        except:
            print("________________________________")
            print("\\nInvalid input or candidate ID.")
            print("---------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        break
    c.commit()
    cursor.close()
    c.close()

def profile():
    c = conn.connect(
        host="localhost",
        user="root",
        password="admin",
        auth_plugin='mysql_native_password',
        database="online_voting_system"
    )
    cursor=c.cursor(buffered=True)
    #Display Information of voter.
    print("\\n________________________________")
    print("\\n- Voter's Profile -")
    print("\\nVOTER ID – ",profile_details[0])
    print("NAME – ",profile_details[1])
    print("FATHER'S NAME – ",profile_details[2])
    print("DATE OF BIRTH – ",profile_details[3])
    print("MOBILE NUMBER – ",profile_details[4])
    print("E-MAIL ID – ",profile_details[5])
    print("CONSISTUENCY – ",profile_details[7])
    if profile_details[8]:
        q = "Yes"
    else:
        q = "No"
    print("VOTED – ",q)
    print("________________________________")
    c.commit()
    cursor.close()
    c.close()

def LOGIN():
    c = conn.connect(
        host="localhost",
        user="root",
        password="admin",
        auth_plugin='mysql_native_password',
        database="online_voting_system"
    )
    cursor=c.cursor(buffered=True)
    global profile_details
    while True:
        email=input("Enter Email ID as (abc456@gmail.com): ")
        m = email.partition("@")
        if m[1]!="@" or m[2]!="gmail.com":
            print("________________________________")
            print("\\nEnter valid email id as(abc456@gmail.com).")
            print("--------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        cursor.execute(f"SELECT password FROM voters WHERE email_id='{email}'")
        r = cursor.fetchone()
        if r is None:
            print("________________________________")
            print("\\nE-mail is not registered. Try again.")
            print("--------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        break
    while True:
        password=input("Enter your password: ")
        if password != r[0]:
            print("________________________________")
            print("\\nIncorrect password. Try again.")
            print("---------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        break
    while True:
        print("\\n--------------------------------")
        print("1. Choose 1 to see your profile.")
        print("2. Choose 2 to vote.")
        print("--------------------------------")
        cursor.execute(f"SELECT * FROM voters WHERE email_id='{email}'")
        profile_details=cursor.fetchone()
        choose=input("Enter your choice: ")
        if choose=="1":
            profile()
        elif choose=="2":
            VOTER_MENU()
        else:
            print("________________________________")
            print("\\nInvalid choice. Try again.")
            print("--------------------------------")
            d = input("Enter '0' to exit or anything else to continue: ")
            if d == '0':
                return
            else:
                continue
        break

if __name__ == '__main__':
    while True:
        print("\\n===== ONLINE VOTING SYSTEM =====")
        print("1. Admin Login")
        print("2. Register as Voter")
        print("3. Login")
        print("4. Exit")
        choice = input("Enter your choice: ")
        if choice == '1':
            #Verification of Admin.
            a_password=input("Enter admin password: ")
            if a_password == admin_password():
                ADMIN_MENU()
            else:
                print("________________________________")
                print("\\nIncorrect Password.")
                print("--------------------------------")
        elif choice == '2':
            REGISTER_VOTER()
        elif choice == '3':
            LOGIN()
        elif choice == '4':
            print("\\n________________________________")
            print("Thank you for using the Online Voting System.")
            break
        else:
            print("________________________________")
            print("\\nInvalid choice. Try again.")
            print("--------------------------------")`;
