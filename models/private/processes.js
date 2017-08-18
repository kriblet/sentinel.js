/**
 * Created by ben on 04/03/2016.
 */
module.exports =  function(connection, mongoose, service){
    let processesSchema  = {
        name: {
            type: String,
            index: {
                unique: true
            },
            required:true},
        inputPattern: {
            type: String,
            index: {
                unique: true
            },
            required:true},
        steps: [{
            onValidate: {type:String,required:true},
            onSuccess: {type:String,required:true},
            onError: {type:String,required:true},
        }],
        responseType: { type: String, enum:['Workspace','Sql', 'PostgreSQL', 'MySql', 'MongoDb', 'Text', 'Image', 'Video', 'Options'], default: 'Workspace'},
        textParameters: [{
            name: String,
            caseSensitive: Boolean,
            separateBy: String,
            between: { start: String, end: String},
            contains: String,
            startWith: String,
            endWith: String,
            function: String
        }],
        content: String,
        caption: String,
        workSpace: String,
        active: {type: Boolean, default: true},
        created_at: {type: Date, default: Date.now}
    };

    return connection.model('processes', processesSchema);
};