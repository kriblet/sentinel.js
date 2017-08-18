/**
 * Created by Ben on 10/06/2017.
 */

let listControllers = (service)=>{

    return [{
        /**
         * Event get gets from model by filters
         * send an acknowledge response to client with the list of items.
         */
        event: 'find',
        worker: (args, ack)=> {
            /*
             * default result will return latest 10 items
             * available args are.
             * args.model = model to get
             * args.query = {} contains the filter query
             * args.limit = Number | contains the limit of items to send back (max 50)
             * args.skip = Number | contains the skip number to start iterate the query
             * args.sort = {} || String | contains the sort for the results, default is -createdAt
             * */
            if (!args.model ){
                return ack({
                    isValid: false,
                    error: 'No model given.'
                });
            }
            args.query = args.query || {};
            args.select = args.select || {};
            args.limit = args.limit || 15;
            args.skip = args.skip || 0;
            args.sort = args.sort || {createdAt: -1};
            args.populate = args.populate || [];

            service.models.mongodb[args.model].find(args.query).select(args.select).limit(args.limit).skip(args.skip).sort(args.sort).populate(args.populate).lean()
                .exec((err, items) => {
                    if (err) {
                        console.log( 'find', err);
                        /* by convention structure for responses*/
                        ack({
                            isValid: false,
                            error: err
                        });
                    } else {
                        console.log("find successfully");
                        /* by convention structure for responses*/
                        ack({
                            isValid: true,
                            data: items
                        });
                    }
                });

        }
    },{
        /**
         * Event get gets from model by filters
         * send an acknowledge response to client with the list of items.
         */
        event: 'findOne',
        worker: (args, ack)=> {
            /*
             * default result will return latest 10 items
             * available args are.
             * args.model = model to get
             * args.query = {} contains the filter query
             * args.limit = Number | contains the limit of items to send back (max 50)
             * args.skip = Number | contains the skip number to start iterate the query
             * args.sort = {} || String | contains the sort for the results, default is -createdAt
             * */
            if (!args.model ){
                return ack({
                    isValid: false,
                    error: 'No model given.'
                });
            }
            args.query = args.query || {};
            args.select = args.select || {};
            args.populate = args.populate || [];

            service.models.mongodb[args.model].findOne(args.query).select(args.select).populate(args.populate).lean()
                .exec((err, items) => {
                    if (err) {
                        console.log( 'findOne', err);
                        /* by convention structure for responses*/
                        ack({
                            isValid: false,
                            error: err
                        });
                    } else {
                        console.log("findOne successfully");
                        /* by convention structure for responses*/
                        ack({
                            isValid: true,
                            data: items
                        });
                    }
                });

        }
    },{
        /**
         * Event get gets from model by filters
         * send an acknowledge response to client with the list of items.
         */
        event: 'findById',
        worker: (args, ack)=> {
            /*
             * default result will return latest 10 items
             * available args are.
             * args.model = model to get
             * args.query = {} contains the filter query
             * args.limit = Number | contains the limit of items to send back (max 50)
             * args.skip = Number | contains the skip number to start iterate the query
             * args.sort = {} || String | contains the sort for the results, default is -createdAt
             * */
            if (!args.model ){
                return ack({
                    isValid: false,
                    error: 'No model given.'
                });
            }
            args.query = args.query || {};
            args.select = args.select || {};
            args.populate = args.populate || [];

            service.models.mongodb[args.model].findById(args.query).select(args.select).populate(args.populate).lean()
                .exec((err, items) => {
                    if (err) {
                        console.log( 'findById', err);
                        /* by convention structure for responses*/
                        ack({
                            isValid: false,
                            error: err
                        });
                    } else {
                        console.log("findById successfully");
                        /* by convention structure for responses*/
                        ack({
                            isValid: true,
                            data: items
                        });
                    }
                });

        }
    },{
        /**
         * Event save saves an item and
         * send an acknowledge response to client with isValid true or false with error.
         */
        event: 'save',
        worker: (args, ack)=>{
            if (!args.model ){
                return ack({
                    isValid: false,
                    error: 'No model given.'
                });
            }
            if (!args.data ){
                return ack({
                    isValid: false,
                    error: 'No data given.'
                });
            }
            console.log("saving",args.data);
            let newItem = new service.models.mongodb[args.model](args.data);
            newItem.save((err)=>{
                if (err){
                    console.log( 'save', err);
                    /* by convention structure for responses*/
                    ack({
                        isValid: false,
                        error: err
                    });

                }else{
                    console.log("save success");
                    /* by convention structure for responses*/
                    let returnItem = newItem.toObject();
                    if (returnItem.password){
                        returnItem.password = '****';
                    }
                    ack({
                        isValid: true,
                        item: returnItem
                    });
                    service.io.sockets.emit(`save-${args.model}`, returnItem);
                }
            })
        }
    },{
        event: 'findByIdAndUpdate',
        worker: (args, ack)=> {
            /*
             * default result will return latest 10 items
             * available args are.
             * args.model = model to update
             * args.new = {} new object with fields to save
             * */
            if (!args.model ){
                return ack({
                    isValid: false,
                    error: 'No model given.'
                });
            }
            if (!args.new ){
                return ack({
                    isValid: false,
                    error: 'No new data given.'
                });
            }
            if (!args.new._id){
                return ack({
                    isValid: false,
                    error: 'No _id found in new data.'
                });
            }

            console.log('trying to update', args.new);
            service.models.mongodb[args.model].findById(args.new._id, (err, data) => {
                if (err) {
                    console.error(err);
                    console.log( 'findByIdAndUpdate', err);
                    /* by convention structure for responses*/
                    ack({
                        isValid: false,
                        error: err
                    });
                } else {
                    if (data) {
                        console.log("findById successfully");
                        Object.keys(args.new).forEach((key)=>{
                            data[key] = args.new[key];
                        });

                        data.save((err)=>{
                            if (err) {
                                ack({
                                    isValid: false,
                                    error: err
                                });
                            }else{
                                console.log("Saved successfully");
                                /* by convention structure for responses*/
                                ack({
                                    isValid: true
                                });
                                let returnItem = data.toObject();
                                if (returnItem.password){
                                    returnItem.password = '****';
                                }

                                service.io.sockets.emit(`update-${args.model}`, returnItem);
                            }
                        })
                    }else{
                        ack({
                            isValid: false,
                            error: 'id not found'
                        });
                    }
                }
            });

        }
    },{
        event: 'findByIdAndDelete',
        worker: (args, ack)=> {
            let self = this;
            /*
             * available args are.
             * args.model = model to update
             * args.data = {} object to delete
             * */
            if (!args.model ){
                return ack({
                    isValid: false,
                    error: 'No model given.'
                });
            }
            if (!args.data ){
                return ack({
                    isValid: false,
                    error: 'No new data given.'
                });
            }
            if (!args.data._id){
                return ack({
                    isValid: false,
                    error: 'No _id found in new data.'
                });
            }

            service.models.mongodb[args.model].findById(args.data._id, (err, data) => {
                if (err) {
                    console.error(err);
                    console.log( 'findByIdAndUpdate', err);
                    /* by convention structure for responses*/
                    ack({
                        isValid: false,
                        error: err
                    });
                } else {
                    if (data) {
                        console.log("findById successfully");
                        data.active = false;
                        data.save((err)=>{
                            if (err) {
                                ack({
                                    isValid: false,
                                    error: err
                                });
                            }else{
                                console.log("Saved successfully");
                                /* by convention structure for responses*/
                                ack({
                                    isValid: true
                                });
                                let returnItem = data.toObject();
                                if (returnItem.password){
                                    returnItem.password = '****';
                                }

                                service.io.sockets.emit(`remove-${args.model}`, returnItem);
                            }
                        })
                    }else{
                        ack({
                            isValid: false,
                            error: 'id not found'
                        });
                    }
                }
            });
        }
    },{
        event: 'autocomplete',
        worker: (args, ack)=> {
            if (!args.model ){
                return ack({
                    isValid: false,
                    error: 'No model given.'
                });
            }
            if (!args.query){
                return ack({
                    isValid: false,
                    error: 'No query given.'
                });
            }
            let _query = {
                $or:[
                    {name: new RegExp(args.query,'i')},
                    {"name.common": new RegExp(args.query,'i')},
                    {"name.native": new RegExp(args.query,'i')},
                    {altSpellings: new RegExp(args.query,'i')},
                    {lastName: new RegExp(args.query,'i')},
                    {maternalSurname: new RegExp(args.query,'i')},
                    {rfc: new RegExp(args.query,'i')},
                    {description: new RegExp(args.query,'i')},
                ]
            };
            if (args.filter){
                _query = {$and: [_query, args.filter]}
            }
            console.log('query',_query);
            args.page = args.page || 0;
            args.select = args.select || '-password';
            args.limit = 15;
            args.skip = args.limit * args.page;
            args.sort = args.sort || {createdAt: -1};
            service.models.mongodb[args.model].find(_query).select(args.select).limit(args.limit).skip(args.skip).sort(args.sort).lean()
                .exec((err, items) => {
                    if (err) {
                        console.log( 'find', err);
                        /* by convention structure for responses*/
                        ack({
                            isValid: false,
                            error: err
                        });
                    } else {
                        console.log("find successfully");
                        /* by convention structure for responses*/
                        ack({
                            isValid: true,
                            data: items
                        });
                    }
                });

        }
    }]

};

module.exports = listControllers;