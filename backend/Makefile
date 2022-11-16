GOBASE=$(shell pwd)
GOBIN=$(GOBASE)/bin

GOLANGLINT_VERSION=v1.46.2

GOLANGCILINT=$(GOBIN)/golangci-lint
SWAG=$(GOBIN)/swag
MOCKGEN=$(GOBIN)/mockgen

.PHONY: install
install:
	GOBIN=$(GOBIN) go install github.com/swaggo/swag/cmd/swag@latest
	GOBIN=$(GOBIN) go install github.com/golangci/golangci-lint/cmd/golangci-lint@$(GOLANGLINT_VERSION)
	GOBIN=$(GOBIN) go install github.com/golang/mock/mockgen@v1.6.0

.PHONY: clean
clean:
	rm -rf $(GOBIN)

.PHONY: docs
docs:
	$(SWAG) init --parseDependency --parseInternal --parseDepth 2 -g cmd/main.go

.PHONY: lint
lint:
	$(GOLANGCILINT) run

.PHONY: mockgen
mockgen:
	$(MOCKGEN) -source=internal/repositories/repository.go -destination=tests/mocks/repositories/repos.go
