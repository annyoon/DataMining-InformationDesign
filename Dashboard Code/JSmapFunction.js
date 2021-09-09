// 지도 생성하는 함수
function drawMap(newNum, center_lat, center_lng, busArr) {
    var container = document.getElementById('map'); // 지도 표시할 div
    var options = {
        center: new kakao.maps.LatLng(center_lat, center_lng), // 지도 중심 좌표
        level: 8 // 지도 확대 레벨
    };
    // 지도 생성
    map = new kakao.maps.Map(container, options);

    // 신규 노선 데이터 가져와서 그리기
    var tmp = "https://raw.githubusercontent.com/annyoon/InformationDesign/master/Dataset/",
        url = tmp + newNum + "/" + newNum + "_UTF-8.csv";

    d3.csv(url, function (data) {
        var station = [], lat = [], lng = [], passenger = [];
        for (var i = 0; i < data.length; i++) {
            station[i] = data[i].station;
            lat[i] = data[i].lat;
            lng[i] = data[i].lng;
            passenger[i] = data[i].geton;
        }
        drawLine(newNum, lat, lng, '#3399FF', '#0068D0', 7, 0.5);
        drawMarker(station, lat, lng, passenger);
    });

    // 비교용 기존 노선 데이터 가져와서 그리기
    for (var i = 0; i < busArr.length; i++) (function (number) {
        var number = busArr[i];
        url = tmp + newNum + "/" + number + ".csv";

        d3.csv(url, function (data) {
            var lat = [], lng = [];
            for (var j = 0; j < data.length; j++) {
                lat[j] = data[j].lat;
                lng[j] = data[j].lng;
            }
            drawLine(number, lat, lng, '#737373', '#3B3B3B', 5, 0);
        })
    })(busArr[i]);
}

// 지도 위에 선 표시하는 함수
function drawLine(number, lat, lng, color, color2, w, z) {
    var linePath = []; // 선을 구성하는 좌표 배열

    for (var i = 0; i < lat.length; i++) {
        var point = new kakao.maps.LatLng(lat[i], lng[i])
        linePath[i] = point
    }

    // 선 생성
    var polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: w,
        strokeColor: color,
        strokeOpacity: 0.8,
        zIndex: z
    });
    // 지도에 선 표시
    polyline.setMap(map);

    // 선에 커스텀 오버레이 생성
    var customOverlay = new kakao.maps.CustomOverlay({
        content: '<div class="map-line">' + number + '</div>',
    });

    // mouseover 이벤트
    kakao.maps.event.addListener(polyline, 'mouseover', function (mouseEvent) {
        polyline.setOptions({ strokeColor: color2 });
        polyline.setOptions({ zIndex: 1 });
        customOverlay.setPosition(mouseEvent.latLng);
        customOverlay.setMap(map);
    });

    // mousemove 이벤트
    kakao.maps.event.addListener(polyline, 'mousemove', function (mouseEvent) {
        customOverlay.setPosition(mouseEvent.latLng);
    });

    // mouseout 이벤트
    kakao.maps.event.addListener(polyline, 'mouseout', function (mouseEvent) {
        polyline.setOptions({ strokeColor: color });
        polyline.setOptions({ zIndex: z });
        customOverlay.setMap(null);
    });
}

// 지도 위에 원(점)과 마커 표시하는 함수
function drawMarker(station, lat, lng, passenger) {
    var circlePos = [], // 원 좌표 저장
        markerPos = []; // 마커 좌표 저장

    for (var i = 0; i < station.length; i++) {
        var point = new kakao.maps.LatLng(lat[i], lng[i])

        // 승차 승객이 10만명 이상인 경우 마커, 아닐 경우 원으로 표시
        if (passenger[i] >= 100000) {
            markerPos.push(
                {
                    latlng: point,
                    content: '<div>' + station[i] + '<br>총 승차 승객 수: ' + passenger[i] + '</div>'
                });
        } else {
            circlePos.push(
                {
                    latlng: point,
                    content: '<div class="map-circle">' + station[i] + '<br>총 승차 승객 수: ' + passenger[i] + '</div>'
                });
        }
    }

    for (var i = 0; i < circlePos.length; i++) {
        // 원 생성
        var circle = new kakao.maps.Circle({
            center: circlePos[i].latlng, // 원의 중심좌표
            radius: 15, // 미터 단위 원의 반지름
            strokeWeight: 12,
            strokeColor: '#3399FF',
            strokeOpacity: 1,
            fillColor: '#3399FF',
            fillOpacity: 1,
            zIndex: 1
        });
        // 지도에 원 표시
        circle.setMap(map);

        // 원에 표시할 커스텀 오버레이 생성
        var customOverlay = new kakao.maps.CustomOverlay({
            position: circlePos[i].latlng,
            content: circlePos[i].content
        });

        kakao.maps.event.addListener(circle, 'mouseover', circleMouseOver(circle, customOverlay));
        kakao.maps.event.addListener(circle, 'mouseout', circleMouseOut(circle, customOverlay));
    }

    for (var i = 0; i < markerPos.length; i++) {
        // 마커 생성
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: markerPos[i].latlng,
        });

        // 마커에 표시할 인포윈도우 생성 
        var infowindow = new kakao.maps.InfoWindow({
            content: markerPos[i].content
        });

        kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
        kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
    }
}

// 원 마우스 이벤트
function circleMouseOver(circle, customOverlay) {
    return function () {
        circle.setOptions({ strokeColor: '#0068D0' });
        circle.setOptions({ fillColor: '#0068D0' });
        customOverlay.setMap(map);
    }
}

function circleMouseOut(circle, customOverlay) {
    return function () {
        circle.setOptions({ strokeColor: '#3399FF' });
        circle.setOptions({ fillColor: '#3399FF' });
        customOverlay.setMap(null);
    }
}

// 마커 마우스 이벤트
function makeOverListener(map, marker, infowindow) {
    return function () { infowindow.open(map, marker); }
}

function makeOutListener(infowindow) {
    return function () { infowindow.close(); }
}