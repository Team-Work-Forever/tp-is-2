package api

type NotFoundError struct {
	message string
}

func (e NotFoundError) Error() string {
	return e.message
}

type AlreadyExistsError struct {
	message string
}

func (e AlreadyExistsError) Error() string {
	return e.message
}
