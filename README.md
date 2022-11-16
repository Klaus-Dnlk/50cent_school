# eliftech-school

## Swagger docs:

**To generate new docs**:

1. Add [API Operation](https://github.com/swaggo/swag#api-operation) annotations in controller code.
2. run `cd backend/` and then `make docs`(for either linux or mac) or `swag init -g cmd/main.go`(for all operating systems).

**To view docs**: simply launch the project and go to _/swager/index.html_ route. For example, to view docs of the project, deployed at localhost and port 8000, you'd have to go to _http://localhost:8000/swagger/index.html_.
