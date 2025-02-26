        // 取得 select 元素
        const yearSelect = document.getElementById("yearSelect");
        const monthSelect = document.getElementById("monthSelect");
        const daySelect = document.getElementById("daySelect");
        const hourSelect = document.getElementById("hourSelect");
        const submitBtn = document.getElementById("selectSubmit");

        // 設定起始與結束年份
        const startYear = 1912;
        const endYear = 2030;

        // 生成年份選單（顯示民國年）
        function generateYearOptions() {
            for (let year = startYear; year <= endYear; year++) {
                let rocYear = year === 1912 ? "元" : year - 1911; // 修正民國元年
                let displayText = `${year}年 (民國${rocYear}年)`;

                let option = document.createElement("option");
                option.value = year;
                option.textContent = displayText;
                yearSelect.appendChild(option);
            }
        }

        // 生成月份選單
        function generateMonthOptions() {
            for (let month = 1; month <= 12; month++) {
                let option = document.createElement("option");
                option.value = month;
                option.textContent = month + " 月";
                monthSelect.appendChild(option);
            }
        }

        document.getElementById("resultText").addEventListener("click", function() {
    copyTextFromElement(this);
        });

        document.getElementById("jinwen").addEventListener("click", function() {
            copyTextFromElement(this);
        });

        document.getElementById("ad").addEventListener("click", function() {
            copyTextFromElement(this);
        });

        function copyTextFromElement(element) {
            let text;
            
            if (element.tagName === "TEXTAREA") {
                text = element.value; // 取得 textarea 內的文字
                element.select(); // 選取 textarea 內文字
                document.execCommand("copy"); // 執行複製
            } else {
                text = element.innerText || element.textContent; // 取得 p 內的文字
                let tempInput = document.createElement("textarea"); // 建立隱藏的 textarea
                tempInput.value = text;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand("copy"); // 執行複製
                document.body.removeChild(tempInput); // 移除暫時的 textarea
            }

            // 顯示「已複製」訊息
            let copyMsg = document.getElementById("copyMessage");
            copyMsg.style.display = "inline"; // 顯示訊息

            // 2 秒後自動隱藏
            setTimeout(() => {
                copyMsg.style.display = "none";
            }, 1000);
        }





        // 依據年份 & 月份動態生成日期選單
        function updateDays() {

            let lunarData = p.Solar2Lunar(yearSelect.value, monthSelect.value, daySelect.value);
            let lunarYear = lunarData[0];
            let lunarMonth = lunarData[1];
            let isLeapMonth = lunarData[3];

            let year = parseInt(yearSelect.value);
            let month = parseInt(monthSelect.value);

            // 各月份的天數
            const daysInMonth = {
                1: 31, 2: isLeapYear(year) ? 29 : 28, 3: 31, 4: 30,
                5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31
            };

            // 清空現有日期選單
            daySelect.innerHTML = "";

            // 產生新的日期選單
            for (let day = 1; day <= daysInMonth[month]; day++) {
                let option = document.createElement("option");
                option.value = day;
                option.textContent = day + " 日";
                daySelect.appendChild(option);
            }
        }

        function generateHourOptions(selectId) {
            const hourSelect = document.getElementById(selectId);

            // 清空選單內容
            hourSelect.innerHTML = "";

            // 生成 0 到 23 小時選項
            for (let hour = 0; hour < 24; hour++) {
                let option = document.createElement("option");
                option.value = hour;
                option.textContent = `${hour} 時`;
                hourSelect.appendChild(option);
            }
        }

        // 初始化小時選單
        document.addEventListener("DOMContentLoaded", function () {
            generateHourOptions("hourSelect");
        });



        // 判斷是否為閏年
        function isLeapYear(year) {
            return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        }

        // 初始化選單
        generateYearOptions();
        generateMonthOptions();
        updateDays();

        // 綁定事件，當年份或月份變更時，更新日期選單
        yearSelect.addEventListener("change", updateDays);
        monthSelect.addEventListener("change", updateDays);

                



        function parseGanZhiArray(result) {
            // 天干 & 地支對照表
            const tianGan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
            const diZhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

            // 解析天干與地支數組
            let tg = result[0]; // 天干數字陣列
            let dz = result[1]; // 地支數字陣列

            // 轉換成對應的干支
            let gz = {
                年柱: tianGan[tg[0]] + diZhi[dz[0]], 
                月柱: tianGan[tg[1]] + diZhi[dz[1]], 
                日柱: tianGan[tg[2]] + diZhi[dz[2]], 
                時柱: tianGan[tg[3]] + diZhi[dz[3]]
            };

            return gz;
        }


        function getYearDebt(ganZhiData) {
        // 年柱的天干地支
        let yearZhu = ganZhiData.年柱; // 取得年柱，例如 "辛亥"

        // 年柱對應的數值表
        const yearDebtData = {
                "甲子": 53000, "丙子": 73000, "戊子": 63000, "庚子": 110000, "壬子": 70000,
                "乙丑": 280000, "丁丑": 42000, "己丑": 80000, "辛丑": 110000, "癸丑": 27000,
                "甲寅": 33000, "丙寅": 80000, "戊寅": 60000, "庚寅": 51000, "壬寅": 96000,
                "乙卯": 80000, "丁卯": 23000, "己卯": 80000, "辛卯": 80000, "癸卯": 33000,
                "甲辰": 29000, "丙辰": 32000, "戊辰": 54000, "庚辰": 57000, "壬辰": 45000,
                "乙巳": 90000, "丁巳": 70000, "己巳": 72000, "辛巳": 57000, "癸巳": 39000,
                "甲午": 40000, "丙午": 53000, "戊午": 90000, "庚午": 62000, "壬午": 70000,
                "乙未": 40000, "丁未": 91000, "己未": 43000, "辛未": 101000, "癸未": 52000,
                "甲申": 70000, "丙申": 33000, "戊申": 80000, "庚申": 61000, "壬申": 42000,
                "乙酉": 40000, "丁酉": 170000, "己酉": 90000, "辛酉": 27000, "癸酉": 50000,
                "甲戌": 27000, "丙戌": 80000, "戊戌": 42000, "庚戌": 110000, "壬戌": 72000,
                "乙亥": 48000, "丁亥": 39000, "己亥": 72000, "辛亥": 71000, "癸亥": 75000
            };

            // 回傳對應的數值，若找不到則回傳 null
            return yearDebtData[yearZhu] || null;
        }





        function getMonthDebt(ganZhiData, lunarYear, lunarMonth, isLeapMonth) {
            // **取得月柱**（例如 "乙亥"）
            let monthZhu = ganZhiData.月柱.trim();

            if (typeof lunarMonth === "undefined") {
                console.error("❌ 錯誤：lunarMonth 沒有傳入！");
                return null;
            }


            // **天干對應的壽生債（萬貫）**
            const monthGanDebt = {
                "甲": 10000, "乙": 20000, "丙": 30000, "丁": 40000, "戊": 50000,
                "己": 6000, "庚": 7000, "辛": 8000, "壬": 9000, "癸": 12000
            };

            // **數字數部分（農曆月份對應的貫數）**
            const lunarMonthDebt = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000];

            // **解析天干 & 地支**
            let gan = monthZhu[0]; // 天干（例如 "乙"）
            let zhi = monthZhu[1]; // 地支（例如 "亥"）

            // **確保 `lunarMonth` 正確**
            if (lunarMonth < 1 || lunarMonth > 12) {
                console.error(`❌ 錯誤：無效的農曆月份 ${lunarMonth}`);
                return null;
            }

            // **如果該年份有閏月，並且 `lunarMonth` 是閏月，記錄警告**
            if (isLeapMonth) {
                console.warn(`⚠️ ${lunarYear} 年的 ${lunarMonth} 月是閏月，確認對應干支是否正確！`);
            }

            // **計算壽生債**
            let ganDebt = monthGanDebt[gan] || 0; // 天干部分
            let zhiDebt = lunarMonthDebt[lunarMonth] || 0; // 使用農曆月份對應數值

            let totalDebt = ganDebt + zhiDebt;

            return totalDebt;
        }

        function getDayDebt(lunarDay) {
            // 確保 `lunarDay` 在 1~30 之間
            if (lunarDay < 1 || lunarDay > 30) {
                console.error(`❌ 錯誤：無效的農曆出生日 ${lunarDay}`);
                return null;
            }

            // **計算壽生債**
            return lunarDay * 1000;
        }

        function getHourDebt(ganZhiData) {
            // **確保 ganZhiData 內有 `時柱`**
            if (!ganZhiData || !ganZhiData.時柱 || ganZhiData.時柱.length !== 2) {
                console.error(`❌ 錯誤：無效的時柱 ${ganZhiData?.時柱}`);
                return null;
            }

            // **取得時柱**（例如 "戊子"）
            let hourZhu = ganZhiData.時柱.trim();

            // **天干對應的壽生債（萬貫）**
            const hourGanDebt = {
                "甲": 10000, "乙": 20000, "丙": 30000, "丁": 40000, "戊": 50000,
                "己": 6000, "庚": 7000, "辛": 8000, "壬": 9000, "癸": 12000
            };

            // **地支對應的數字數部分壽生債（貫）**
            const hourNumberDebt = {
                "子": 1000, "丑": 2000, "寅": 3000, "卯": 4000, "辰": 5000,
                "巳": 6000, "午": 7000, "未": 8000, "申": 9000, "酉": 10000,
                "戌": 11000, "亥": 12000
            };

            // **解析天干 & 地支**
            let gan = hourZhu[0]; // **天干**（例如 "戊"）
            let zhi = hourZhu[1]; // **地支**（例如 "子"）

            // **確保 `gan` 和 `zhi` 是有效值**
            if (!(gan in hourGanDebt) || !(zhi in hourNumberDebt)) {
                console.error(`❌ 錯誤：無效的時柱 ${hourZhu}`);
                return null;
            }

            // **計算總壽生債**
            let totalDebt = (hourGanDebt[gan] || 0) + (hourNumberDebt[zhi] || 0);

            return totalDebt;
        }

        let un_checked_btn = document.getElementById('unknownHour');

        function calculateTotalDebt(ganZhiData, lunarYear, lunarMonth, lunarDay, isLeapMonth) {
            if(un_checked_btn.checked) {
                let yearDebt = getYearDebt(ganZhiData) || 0;
                let monthDebt = getMonthDebt(ganZhiData, lunarYear, lunarMonth, isLeapMonth) || 0;
                let dayDebt = getDayDebt(lunarDay) || 0;
                let hourDebt = 0;
                let totalDebt = yearDebt + monthDebt + dayDebt + hourDebt;
                console.log(`🌕 年壽生債: ${yearDebt}`);
                console.log(`📆 月壽生債: ${monthDebt}`);
                console.log(`📅 日壽生債: ${dayDebt}`);
                console.log(`🕐 時壽生債: ${hourDebt}`);
                console.log(`🔥 四柱總陰債: ${totalDebt}`);
                return totalDebt;
            } 
                let yearDebt = getYearDebt(ganZhiData) || 0;
                let monthDebt = getMonthDebt(ganZhiData, lunarYear, lunarMonth, isLeapMonth) || 0;
                let dayDebt = getDayDebt(lunarDay) || 0;
                let hourDebt = getHourDebt(ganZhiData) || 0;
                let totalDebt = yearDebt + monthDebt + dayDebt + hourDebt;
                console.log(`🌕 年壽生債: ${yearDebt}`);
                console.log(`📆 月壽生債: ${monthDebt}`);
                console.log(`📅 日壽生債: ${dayDebt}`);
                console.log(`🕐 時壽生債: ${hourDebt}`);
                console.log(`🔥 四柱總陰債: ${totalDebt}`);
                return totalDebt;
        }


        

        submitBtn.addEventListener('click', ()=> {
            let v = parseGanZhiArray(p.GetGZ(yearSelect.value, monthSelect.value, daySelect.value, hourSelect.value));

            if(un_checked_btn.checked)
            {
                // **獲取農曆資訊**
                let lunarData = p.Solar2Lunar(yearSelect.value, monthSelect.value, daySelect.value);
                let lunarYear = lunarData[0];    // 農曆年
                let lunarMonth = lunarData[1];   // 農曆月
                let lunarDay = lunarData[2];     // 農曆日（初幾）
                let isLeapMonth = lunarData[3];  // 是否為閏月
                console.log("🌕 農曆日期:", lunarYear, "年", lunarMonth, "月", lunarDay, "日");
                console.log("📜 干支四柱:", v);
                // **計算四柱總陰債**
                let totalDebt = calculateTotalDebt(v, lunarYear, lunarMonth, lunarDay, isLeapMonth);
                console.log(`🔥 四柱陰債總計: ${totalDebt+7000} ~ ${totalDebt+62000} 貫`);
                document.getElementById("resultText").value = 
                `🙏 小編有請法師幫您查詢，法師指示：\n` +
                `📜 由於您未提供時辰，系統計算出生時間 **0 時至 23 時** 的陰債範圍如下：📅\n` +
                `💰 陰債可能範圍：${totalDebt + 7000} ~ ${totalDebt + 62000} 貫 🔥`;


            } else {
            // **獲取農曆資訊**
            let lunarData = p.Solar2Lunar(yearSelect.value, monthSelect.value, daySelect.value);
            let lunarYear = lunarData[0];    // 農曆年
            let lunarMonth = lunarData[1];   // 農曆月
            let lunarDay = lunarData[2];     // 農曆日（初幾）
            let isLeapMonth = lunarData[3];  // 是否為閏月
            console.log("🌕 農曆日期:", lunarYear, "年", lunarMonth, "月", lunarDay, "日");
            console.log("📜 干支四柱:", v);
            // **計算四柱總陰債**
            let totalDebt = calculateTotalDebt(v, lunarYear, lunarMonth, lunarDay, isLeapMonth);
            console.log(`🔥 四柱陰債總計: ${totalDebt} 貫`);
            document.getElementById("resultText").value = 
            `🙏 小編有請法師幫您查詢，法師指示：\n` +
            `📜 依照您給的生辰所計算出，您所欠的陰債共為冥間紙錢：\n` +
            `💰 **${totalDebt} 貫** 🔥`;
            }
        });
