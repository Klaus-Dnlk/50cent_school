package command

type Pagination struct {
	Page     int `form:"page"      query:"page"`
	PageSize int `form:"page_size" query:"page_size"`
}
