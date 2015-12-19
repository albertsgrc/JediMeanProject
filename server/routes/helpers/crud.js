module.exports = {
    complete: function(router, model, population, onDelete) {
        router.get('/', function(req, res){
            req.body = req.body || {};
            req.body.user = req.user._id;
            console.log(req.body);
            model.find(req.body, function(err, result){
                if(err) res.status(500).json(err);
                else res.status(200).json(result);
            }).populate(population);
        });

        router.get('/:id', function(req, res){
            model.findOne( { _id: req.params.id, user: req.user._id },function(err, result){
                if(err) res.status(500).json(err);
                else res.status(200).json(result);
            }).populate(population);
        });

        router.post('/', function(req, res){
            req.body.user = req.user._id;
            new model(req.body)
                .save(function(err, result){
                    if(err) {
                        res.status(500).json(err);
                    }
                    else res.status(200).json(result);
                });
        });

        router.patch('/:id', function(req, res){
            model.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(err, result){
                if(err) {
                    res.status(500).json(err);
                }
                else res.status(200).json(result);
            });
        });

        router.delete('/:id', function(req, res){
            model.findOneAndRemove({ _id: req.params.id, user: req.user._id } ,function(err, result){
                if(err) res.status(500).json(err);
                else {
                    if (onDelete) onDelete(req.params.id, res, result);
                    else res.status(200).json(result);
                }
            });
        });
    }
};