// 인포 텍스트 관련 함수
function print_info(rnk, psg, stp, stp1, stp2, dist, txt, trm) {
    if (info.style.display === "none") {
        info.style.display = "block";
    }
    const rank = document.getElementById("rnk");
    rank.textContent = rnk;
    const passengers = document.getElementById("psg");
    passengers.textContent = psg;
    const station = document.getElementById("stp");
    station.textContent = stp;
    const begin = document.getElementById("stp1");
    begin.textContent = stp1;
    const end = document.getElementById("stp2");
    end.textContent = stp2;
    const distance = document.getElementById("dist");
    distance.textContent = dist;
    const description = document.getElementById("txt");
    description.textContent = txt;
    const term = document.getElementById("trm");
    term.textContent = trm;
}

// 콤보 박스 조건 함수
function chageRouteSelect(selectRoute) {
    if (selectRoute == "New1") {
        print_info(10.3, 662127, 54, '쌍문역', '서울역버스환승센터', 15.6, '새롭게 만든 노선', 7);

        newNum = "New1";
        var busArr = ["bus103", "bus106", "bus107", "bus109", "bus140", "bus150", "bus151", "bus160", "bus710"];
        drawMap(newNum, 37.60207, 127.02425, busArr);
        drawBarPlot(newNum, 0, 23); drawLinePlot(newNum); drawScatterPlot(newNum);
    }
    else if (selectRoute == "New2") {
        print_info(18.2, 572059, 43, '서울역버스환승센터', '도곡개포한신아파트', 19, '기존 406번 버스를 개선한 노선', 9);

        newNum = "New406";
        var busArr = ["bus143", "bus400", "bus401", "bus402", "bus405", "bus406", "bus420", "bus421"];
        drawMap(newNum, 37.52419, 126.99300, busArr);
        drawBarPlot(newNum, 0, 23); drawLinePlot(newNum); drawScatterPlot(newNum);
    }
    else if (selectRoute == "New3") {
        print_info(78, 256404, 33, '수서역', '송파더센트레. 송례중앞', 14.1, '기존 343번 버스를 개선한 노선', 13);

        newNum = "New343";
        var busArr = ["bus301", "bus302", "bus303", "bus333", "bus343", "bus362", "bus402", "bus452"];
        drawMap(newNum, 37.48897, 127.10608, busArr);
        drawBarPlot(newNum, 0, 23); drawLinePlot(newNum); drawScatterPlot(newNum);
    }
}