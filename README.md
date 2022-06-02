

#0. 要是 op files 還沒產生出來前, result.xml 顯示為

        <?xml version="1.0"?>
        <csv_data>
        <row>
            <卡號>#1</卡號>
            <姓名>Steven</姓名>
            <車隊>team1</車隊>
            <車型>BMW M4</車型>
            <日期>2019-03-02 11:16:07</日期>
            <車競賽>1</車競賽>
            <最佳圈秒數>N/A</最佳圈秒數>
        </row>
        <row>
            <卡號>#2</卡號>
            <姓名>Michael</姓名>
            <車隊>team2</車隊>
            <車型>McLaren 720S</車型>
            <日期>2019-06-01 10:06:07</日期>
            <車競賽>1</車競賽>
            <最佳圈秒數>N/A</最佳圈秒數>
        </row>
        <row>
            <卡號>#3</卡號>
            <姓名>Albert</姓名>
            <車隊>team3</車隊>
            <車型>Porsche 918 GTR</車型>
            <日期>2019-04-05 16:30:07</日期>
            <車競賽>1</車競賽>
            <最佳圈秒數>N/A</最佳圈秒數>
        </row>
        </csv_data>


#1. xxxxxx_op files 每一條的絕對時間點是從最後12 characters裡頭擷取的


      - 使用block 6理頭的 convertToTimestamp Method. Input 是 string . Output 是 絕對時間點（以毫秒為單位）


            # Input = HH:MM:SS.SSS
            # Output = miliSecond Timestamp

            # 1 hr = 60 * 60 * 1000 = 3_600_000 
            # 1 min = 60 * 1000 = 60_000  
            # 1 sec = 1000 = 1_000  

            from datetime import timedelta
            def convertToTimeStamp(timeStr):
                h, m, s = map(float, timeStr.split(':'))
                res = timedelta(hours=h, minutes=m, seconds=s).total_seconds() * 1000
                return int(res)

            舉例來說：

                Input = "16:06:33.021"         
                Output = 57993021


                Input = "16:08:58.424"
                Output = 58138424

        - 使用 block 9裡頭的 formattedTime 來轉換成 mm:ss.sss


            # Input = ms
            # Output = nn:sec.mm
            def formattedTime(timeStamp):
                
                msPerMin = 60*1000

                minutes = math.trunc(timeStamp/(msPerMin))
                seconds = math.trunc((timeStamp - (minutes * msPerMin)) / 1000); 
                miliSeconds = timeStamp % 1000; 

                minutes = str(minutes).rjust(2,"0")
                seconds = str(seconds).rjust(2,"0")
                miliSeconds = str(miliSeconds).rjust(3,"0")
                        
                return (minutes + ":" + seconds + "." + miliSeconds)


        - 支援至少兩組到最多五組的資料（可自行在 block 11 data_process.ipynb 裡頭調整）

                if(i == 1):
                    df.loc[index, '第一圈秒數'] = timeTravel
                elif(i == 2):
                    df.loc[index, '第二圈秒數'] = timeTravel
                elif(i == 3):
                    df.loc[index, '第三圈秒數'] = timeTravel
                elif(i == 4):
                    df.loc[index, '第四圈秒數'] = timeTravel
                elif(i == 5):
                    df.loc[index, '第五圈秒數'] = timeTravel

      - demo（)

        # 1014E3_op

            1651545100 472058 2022/05/03 Tue - 10:24:00.472
            1651545200 686995 2022/05/03 Tue - 10:32:09.686
            1651545300 408053 2022/05/03 Tue - 10:34:14.408
            1651545400 79984 2022/05/03 Tue - 10:38:14.079
            1651545500 802198 2022/05/03 Tue - 10:42:09.802
            1651545600 426224 2022/05/03 Tue - 10:43:05.426

        # 1014E9_op

            1651545100 472058 2022/05/03 Tue - 10:33:00.472
            1651545300 686995 2022/05/03 Tue - 10:34:01.472
            1651545450 408053 2022/05/03 Tue - 10:37:14.408
            1651545500 79984 2022/05/03 Tue - 10:39:14.079
            1651545670 802198 2022/05/03 Tue - 10:41:10.802
            1651545850 426224 2022/05/03 Tue - 10:43:05.426


        # 10155D_op

            1651545180 472058 2022/05/03 Tue - 10:33:00.472
            1651545309 686995 2022/05/03 Tue - 10:35:09.686
            1651545509 686995 2022/05/03 Tue - 10:35:10.686
            1651545559 686995 2022/05/03 Tue - 10:39:49.236

#2. 在 data_process.ipynb 請修改 block 11 裡頭的

    - os.chdir("/Users/stevenkan/Documents/Project/Race_Car_Stream") 路徑到包含   
      data_process.ipynb的路徑



#3. 此程式的 race_cars_info.xml 只包含三個賽車手的資料, 如果你有更多的賽車手, 請自行修改.

    - 請到 data_process.ipynb 的 block 3 理頭, 依序把 cardIDMAP 跟 bestScoreMap理頭的key 自行修改. 
      要是 op尾名的files 不存在於車競賽裡頭, 程式會自動忽略

        # demo code （此車競賽只有三組卡號： 1014E3 , 1014E9, 10155D)

            cardIDMap = {}
            cardIDMap["1014E3"] = "#1"        # Steven
            cardIDMap["1014E9"] = "#2"        # Albert
            cardIDMap["10155D"] = "#3"        # Michael 

            import math
            bestScoreMap = {}
            bestScoreMap["1014E3"] = math.inf        # Steven
            bestScoreMap["1014E9"] = math.inf        # Albert
            bestScoreMap["10155D"] = math.inf        # Michael  


#4. 此程式只預設跑5秒鐘的時間, 請自行修改時間

    - 請到 data_process.ipynb 的 block 16 理頭, 自行修改 apprx_finish_second


#5. 排名的成績根據最佳的秒數

    For example #1(要是秒數相同的話 成績也相同)

        <?xml version="1.0"?>
        <csv_data>
        <row>
            <卡號>#2</卡號>
            <姓名>Michael</姓名>
            <車隊>team2</車隊>
            <車型>McLaren 720S</車型>
            <日期>2019-06-01 10:06:07</日期>
            <車競賽>1</車競賽>
            <第一圈秒數>00:01.000</第一圈秒數>
            <第二圈秒數>04:12.936</第二圈秒數>
            <第三圈秒數>01:59.671</第三圈秒數>
            <第四圈秒數>01:56.723</第四圈秒數>
            <第五圈秒數>01:54.624</第五圈秒數>
            <最佳圈秒數>00:01.000</最佳圈秒數>
            <排名>1</排名>
        </row>
        <row>
            <卡號>#3</卡號>
            <姓名>Albert</姓名>
            <車隊>team3</車隊>
            <車型>Porsche 918 GTR</車型>
            <日期>2019-04-05 16:30:07</日期>
            <車競賽>1</車競賽>
            <第一圈秒數>02:09.214</第一圈秒數>
            <第二圈秒數>00:01.000</第二圈秒數>
            <第三圈秒數>04:38.550</第三圈秒數>
            <第四圈秒數></第四圈秒數>
            <第五圈秒數></第五圈秒數>
            <最佳圈秒數>00:01.000</最佳圈秒數>
            <排名>1</排名>
        </row>
        <row>
            <卡號>#1</卡號>
            <姓名>Steven</姓名>
            <車隊>team1</車隊>
            <車型>BMW M4</車型>
            <日期>2019-03-02 11:16:07</日期>
            <車競賽>1</車競賽>
            <第一圈秒數>08:09.214</第一圈秒數>
            <第二圈秒數>02:04.722</第二圈秒數>
            <第三圈秒數>03:59.671</第三圈秒數>
            <第四圈秒數>03:55.723</第四圈秒數>
            <第五圈秒數>00:55.624</第五圈秒數>
            <最佳圈秒數>00:55.624</最佳圈秒數>
            <排名>2</排名>
        </row>
        </csv_data>


    For example #2: 

        <?xml version="1.0"?>
        <csv_data>
        <row>
            <卡號>#3</卡號>
            <姓名>Albert</姓名>
            <車隊>team3</車隊>
            <車型>Porsche 918 GTR</車型>
            <日期>2019-04-05 16:30:07</日期>
            <車競賽>1</車競賽>
            <第一圈秒數>02:09.214</第一圈秒數>
            <第二圈秒數>00:01.000</第二圈秒數>
            <第三圈秒數>04:38.550</第三圈秒數>
            <第四圈秒數></第四圈秒數>
            <第五圈秒數></第五圈秒數>
            <最佳圈秒數>00:01.000</最佳圈秒數>
            <排名>1</排名>
        </row>
        <row>
            <卡號>#1</卡號>
            <姓名>Steven</姓名>
            <車隊>team1</車隊>
            <車型>BMW M4</車型>
            <日期>2019-03-02 11:16:07</日期>
            <車競賽>1</車競賽>
            <第一圈秒數>08:09.214</第一圈秒數>
            <第二圈秒數>02:04.722</第二圈秒數>
            <第三圈秒數>03:59.671</第三圈秒數>
            <第四圈秒數>03:55.723</第四圈秒數>
            <第五圈秒數>00:55.624</第五圈秒數>
            <最佳圈秒數>00:55.624</最佳圈秒數>
            <排名>2</排名>
        </row>
        <row>
            <卡號>#2</卡號>
            <姓名>Michael</姓名>
            <車隊>team2</車隊>
            <車型>McLaren 720S</車型>
            <日期>2019-06-01 10:06:07</日期>
            <車競賽>1</車競賽>
            <第一圈秒數>01:01.000</第一圈秒數>
            <第二圈秒數>03:12.936</第二圈秒數>
            <第三圈秒數>01:59.671</第三圈秒數>
            <第四圈秒數>01:56.723</第四圈秒數>
            <第五圈秒數>01:54.624</第五圈秒數>
            <最佳圈秒數>01:01.000</最佳圈秒數>
            <排名>3</排名>
        </row>
        </csv_data>

        
    