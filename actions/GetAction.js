var async = require("async");

var IGetAction = require("./interfaces/IGetAction");

class GetAction extends IGetAction {
    constructor(repository, dTOMapper, uidValidator) {
        super();

        this.repository = repository;
        this.dTOMapper = dTOMapper;
        this.uidValidator = uidValidator;
    }

    use(req, res, next) {
        try {
            var params = this.uidValidator.validate(req.params);
            var id = params.id;
        } catch (err) {
            return next(err);
        }

        async.waterfall([
            (cb) => {
                this.repository.getByUid(id).then((entity) => {
                    if (entity === undefined) {
                        var err = new Error('Not Found');
                        err.status = 404;
                        return next(err);
                    }

                    var dto = this.dTOMapper.map(entity);

                    cb(null, dto);
                }, err => {
                    cb(err);
                });
            }
        ], (err, dto) => {
            if (err) {
                var error = new Error(err);
                error.status = 500;
                return next(error);
            }

            res.send({
                data: dto
            });
        });
    }
};

module.exports = GetAction;