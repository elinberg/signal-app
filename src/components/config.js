
const LeightWeightCharts = require('lightweight-charts')
export default  {
        handleScroll: {
            mouseWheel: true,
            pressedMouseMove: true,
        },
        handleScale: {
            axisPressedMouseMove: true,
            mouseWheel: true,
            pinch: true,
        },
        crosshair: {
            mode: LeightWeightCharts.CrosshairMode.Normal,
        },
        localization: {
            priceFormatter: price => {
                // add $ sign before price
                //console.log('PRICE', price)
                //'$' + price
                return parseFloat(price).toFixed(8);
            },
            timeFormatter: businessDayOrTimestamp => {
                // console.log(businessDayOrTimestamp);

                if (LeightWeightCharts.isBusinessDay(businessDayOrTimestamp)) {
                    //console.log('BizDay',businessDayOrTimestamp);
                    return businessDayOrTimestamp;
                }

                let t = {};
                let date = new Date(parseInt(businessDayOrTimestamp) * 1000)
                t.year = date.toLocaleString("en-US", { year: "numeric" })
                t.month = date.toLocaleString("en-US", { month: "numeric" })
                t.day = date.toLocaleString("en-US", { month: "short", day: "2-digit" });//+ self.cnt++
                t.hour = date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }).replace(' PM', '').replace(' AM', '')
                t.minute = date.toLocaleTimeString("en-US", { minute: '2-digit' }).replace(' AM', '').replace(' PM', '')
                t.second = date.toLocaleTimeString("en-US", { second: '2-digit' })
                //t.year + '-'+ t.month+'-'+t.day + ' '
                let time = t.day + ' ' + t.hour //+ ':'+t.minute + ':' + t.second;
                //console.log('Timestamp Format',time);
                return String(time);
            }
        },
        priceScale: {
            mode: 1,
            autoScale: true,
            drawTicks: true,
            invertScale: false,
            alignLabels: false,
            borderVisible: true,
            borderColor: '#555ffd',
            scaleMargins: {
                top: 0.30,
                bottom: 0.25,
            }
        },
        timeScale: {
            // rightOffset: 12,
            // barSpacing: 3,
            // fixLeftEdge: true,
            // lockVisibleTimeRangeOnResize: true,
            autoScale: true,
            rightBarStaysOnScroll: true,
            borderVisible: false,
            borderColor: "#fff000",
            visible: true,
            timeVisible: true,
            secondsVisible: true,
            tickMarkFormatter: (time, tickMarkType, locale) => {
                console.log('TIME', time, tickMarkType, locale);
                const year = LeightWeightCharts.isBusinessDay(time) ? time.year : new Date(time * 1000).getUTCFullYear();
                var month = LeightWeightCharts.isBusinessDay(time) ? time.month : new Date(time * 1000).getUTCMonth();
                const day = LeightWeightCharts.isBusinessDay(time) ? time.day : new Date(time * 1000).getUTCDay();
                var hour = LeightWeightCharts.isBusinessDay(time) ? time.hour : new Date(time * 1000).toLocaleTimeString("en-US", { hour: '2-digit' }).replace(' PM', '').replace(' AM', '')
                const minute = LeightWeightCharts.isBusinessDay(time) ? time.minute : new Date(time * 1000).toLocaleTimeString("en-US", { minute: '2-digit', second:'2-digit' })
                //const second = LeightWeightCharts.isBusinessDay(time) ? time.second : new Date(time * 1000).getUTCSeconds();
                //const month  = true ? time.month : new Date(time * 1000).getUTCFullYear();
                hour += ':'
                hour += minute
                return String(hour);
            }
        }
        //

 }





