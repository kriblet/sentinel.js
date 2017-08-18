/**
 * Created by ben on 09/11/2015.
 */
module.exports =  function(connection, mongoose, service){
    let positionsSchema = {
        deviceId: {type: mongoose.Schema.Types.ObjectId, ref: 'devices', index:{unique:false}},
        vehicleId: {type: mongoose.Schema.Types.ObjectId, ref: 'vehicles', index:{unique:false}},
        alertId: {type: mongoose.Schema.Types.ObjectId, ref: 'alertsTriggered', index:{unique:false}},
        createdAt: { type: Date, default: Date.now, index:{unique:false}},
        keyword: { type: String, index:{unique:false}}, //1
        time: { type: Number , index:{unique:false}, required: true }, //2
        date: { type: Date , index:{unique:false}, required: true }, //2
        cellPhoneNumber: { type: String }, //3
        fl:{ type: String }, //4
        null2:{ type: String }, //5
        av:{ type: String }, //6
        lat:{ type: Number , required: true }, //7
        sn:{ type: String }, //8
        lng:{ type: Number , required: true }, //9
        ew:{ type: String }, //10
        speed:{ type: String }, //11
        "direction-address":{ type: String }, //12
        direction: { type:String },
        altitude:{ type: String }, //13
        accState:{ type: String }, //14
        doorState:{ type: String }, //15
        fuelSensor1:{ type: String }, //16
        fuelSensor2:{ type: String }, //17
        temperature:{ type: String },
        location: {
            type: [Number],
            index: '2d'
        },
        stopTime: {type:Number, default: 0},
        satellites: { type: Number , index:{unique:false}},
        timeOffset: { type: Number , index:{unique:false}}
    };

    return connection.model('positions',positionsSchema);
};
