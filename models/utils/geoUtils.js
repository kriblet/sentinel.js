/**
 * Created by edgardo on 2/5/17.
 */

module.exports = {
    degreesToRadians: function (degrees) {
        return degrees * (Math.PI / 180);
    },
    coordinatesToKMs: function (initPoint, finalPoint) {
        const R = 6371; // Radius of the earth in KM

        let dLat = this.degreesToRadians(finalPoint.lat - initPoint.lat);
        let dLon = this.degreesToRadians(finalPoint.lng - initPoint.lng);
        let initLat = this.degreesToRadians(initPoint.lat);
        let finalLat = this.degreesToRadians(finalPoint.lat);

        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(initLat) * Math.cos(finalLat);

        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },
    multiplePointsToKMs: function (positions) {
        let distance = 0;
        let number = positions.length -1;
        for (let i = number; i > 0; i--) {
            let thisPoint = positions[i];
            let previousPoint = positions[i-1];
            if (thisPoint.accState != '0' && thisPoint.speed != '0') {
                if (thisPoint.lat != previousPoint.lat && thisPoint.lng != previousPoint.lng) {
                    thisPoint.lat = parseFloat(thisPoint.lat);
                    thisPoint.lng = parseFloat(thisPoint.lng);
                    previousPoint.lat = parseFloat(previousPoint.lat);
                    previousPoint.lng = parseFloat(previousPoint.lng);
                    let kms = this.coordinatesToKMs(thisPoint, previousPoint);
                    if (kms > 0.05 && kms < 1) {
                        distance += kms;
                    } else {
                        positions.splice(i, 1);
                    }
                }
            }
        }
        return distance;
    },
    gasConsumption: function (vehicle, distance) {
        if (vehicle && vehicle.performance && !isNaN(distance)) {
            try {
                let performance = parseFloat(vehicle.performance);
                return distance / performance;
            } catch (except) {
                console.warn(except);
                return null;
            }
        } else {
            return null;
        }
    }
};