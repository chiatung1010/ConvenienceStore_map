let map;

let locationAll = []

async function fetchJsonFile(store, cityData) {
    // console.log('fetchJsonFile')
    // console.log('store=>', store)
    // console.log('cityData=>', cityData)

    try {
        const response = await fetch(`./store_data/${store}/${cityData}.json`)
        
        if (response.ok) {
            const jsonText = await response.text();
            const jsonData = JSON.parse(jsonText);
            
            // console.log(`成功取得 ${cityData}.json 資料：`, jsonData);

            if(jsonData.stores){
                let jsonData_stores = jsonData.stores
                if(jsonData_stores.length > 0){
                    jsonData_stores.map(function(e){
                        let location = { lat: e.lat, lng: e.lng }
                        locationAll.push(location)
                    })
                }
            }

        } else {
            console.error(`無法取得 ${cityData}.json 資料。`);
        }
    } catch (error) {
        console.error(`發生錯誤：`, error);
    }
}

async function fetchAllJsonFiles(store, city) {
    for (const cityData of city) {
        // console.log('42 cityData =>', cityData)
        if(cityData != '全台灣'){
            await fetchJsonFile(store, cityData);
        }
    }
}


async function initMap() {
    // const store = ["711", "familymart", "hilife", "okmart"];
    
    // const county = ["台北市","基隆市","新北市","連江縣","宜蘭縣","新竹市","新竹縣","桃園市","苗栗縣","台中市",
    // "彰化縣","南投縣","嘉義市","嘉義縣","雲林縣","台南市","高雄市","澎湖縣","金門縣","屏東縣","台東縣","花蓮縣"]
    
    const countyData = [
        {
            "city": "全台灣",
            "add": { lat: 23.58, lng: 120.58 },
            "zoom": 7.8
        },
        {
            "city": "台北市",
            "add": {lat: 25.09108, lng: 121.5598}
        },
        {
            "city": "基隆市",
            "add": {lat: 25.10898, lng: 121.7081}
        },
        {
            "city": "新北市",
            "add": {lat: 24.99751, lng: 121.51657}
            // "add": {lat: 24.91571, lng: 121.6739}
        },
        {
            "city": "連江縣",
            "add": {lat: 26.28603, lng: 120.19648}
            // "add": {lat: 26.19737, lng: 119.5397}
        },
        {
            "city": "宜蘭縣",
            "add": {lat: 24.69295, lng: 121.7195}
        },
        {
            "city": "新竹市",
            "add": {lat: 24.80395, lng: 120.9647}
        },
        {
            "city": "新竹縣",
            "add": {lat: 24.80427, lng: 121.07926}
            // "add": {lat: 24.70328, lng: 121.1252}
        },
        {
            "city": "桃園市",
            "add": {lat: 24.93759, lng: 121.2168}
        },
        {
            "city": "苗栗縣",
            "add": {lat: 24.56343, lng: 120.86755}
            // "add": {lat: 24.48927, lng: 120.9417}
        },
        {
            "city": "台中市",
            "add": {lat: 24.19782, lng: 120.69784}
            // "add": {lat: 24.23321, lng: 120.9417}
        },
        {
            "city": "彰化縣",
            "add": {lat: 23.99297, lng: 120.4818}
        },
        {
            "city": "南投縣",
            "add": {lat: 23.85777, lng: 120.92100}
            // "add": {lat: 23.83876, lng: 120.9876}
        },
        {
            "city": "嘉義市",
            "add": {lat: 23.47545, lng: 120.4473}
        },
        {
            "city": "嘉義縣",
            "add": {lat: 23.45600, lng: 120.47284}
            // "add": {lat: 23.45889, lng: 120.574}
        },
        {
            "city": "雲林縣",
            "add": {lat: 23.75585, lng: 120.3897}
        },
        {
            "city": "台南市",
            "add": {lat: 23.1417, lng: 120.2513}
        },
        {
            "city": "高雄市",
            "add": {lat: 22.74314, lng: 120.37730}
            // "add": {lat: 23.01087, lng: 120.666}
        },
        {
            "city": "澎湖縣",
            "add": {lat: 23.56548, lng: 119.6151}
        },
        {
            "city": "金門縣",
            "add": {lat: 24.43679, lng: 118.3186}
        },
        {
            "city": "屏東縣",
            "add": {lat: 22.54951, lng: 120.62}
        },
        {
            "city": "台東縣",
            "add": {lat: 22.82468, lng: 121.15165}
            // "add": {lat: 22.98461, lng: 120.9876}
        },
        {
            "city": "花蓮縣",
            "add": {lat: 24.00104, lng: 121.54767}
            // "add": {lat: 23.7569, lng: 121.3542}
        },
    ]

    const cityData = countyData.map(e => {
        return e.city
    })
    
    var county = document.getElementById('county');
    countyData.map(
        function(e, i){
            
            let option = document.createElement('option');
            option.value = i

            let text = document.createTextNode(e.city);
            option.appendChild(text);

            county.appendChild(option)
        }
    )


    let store = ''
    const storebtn = document.querySelectorAll(".storebtn");
    storebtn.forEach(button => {
        button.addEventListener('click', async function (e) { 
            store = e.target.value
            console.log('222 store =>', store)
            
            storebtn.forEach( b => {
                b.classList.remove('btnclick')    
            })
            e.target.classList.add('btnclick')

        }, false);
    })

    var gobtn = document.getElementById('gobtn');
    gobtn.addEventListener('click', async function (e) { 
        // console.log('221 county=>', county)
        let t = county.value
        console.log('222:t ->', t)

        let add = { lat: 23.58, lng: 120.58 } // 預設 全台灣視角
        let zoomVal = 7.8 // 預設 視野大小

        if(t){
            if(countyData[t].add){
                add = countyData[t].add
            }
    
            if(countyData[t].city){
                var city = countyData[t].city
            }
        }

        const { AdvancedMarkerView } = await google.maps.importLibrary("marker");
        
        let storeNum = document.getElementById('storeNum');

        locationAll = [] // 歸零

        console.log('316 store =>', store)
        console.log('city =>', city)
    
                
        if(city == "全台灣"){
            if(store){
                await fetchAllJsonFiles(store, cityData);
            }
        }
        else if(city != undefined){
            if(store && city){
                await fetchJsonFile(store, city);
            }
            zoomVal = 11
        }

        
        if (locationAll.length > 0) {
            // 創建新的地圖
            map = new google.maps.Map(document.getElementById("map"), {
                zoom: zoomVal,
                center: add, 
                mapId: "DEMO_MAP_ID",
            });
    
            // 使用迴圈在地圖上建立每個位置的標記點
            locationAll.forEach((position) => {
                const pinViewScaled = new google.maps.marker.PinView({
                    scale: 0.5,
                });

                const marker = new AdvancedMarkerView({
                    map: map,
                    position: position,
                    title: position.title,
                    content: pinViewScaled.element,
                });
            });

            storeNum.innerHTML = `${city}的${store}便利商店 共${locationAll.length}間店`

        } else {
            map = new google.maps.Map(document.getElementById("map"), {
                zoom: zoomVal,
                center: add, 
                mapId: "DEMO_MAP_ID",
            });

            storeNum.innerHTML = `${city}的${store}便利商店 共0間店`

            if(!store || !city){
                storeNum.innerHTML = `請選擇欲查詢的縣市/便利商店`
            }
        }
    })

    

    // 進入預設載入

    // 等待載入 Google 地圖相關的模組
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

    // 定義地圖的選項，包含縮放等級、地圖中心及地圖 ID
    map = new Map(document.getElementById("map"), {
        zoom: 7.8,
        // center: positions[0],
        center: { lat: 23.58, lng: 120.58 }, 
        mapId: "DEMO_MAP_ID",
    });

}

initMap();