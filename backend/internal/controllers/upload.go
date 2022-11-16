package controllers

import (
	"net/http"

	"50Cent/backend/internal/command"

	"github.com/gin-gonic/gin"
)

// @Summary      Personal ID info files upload
// @Tags         Upload
// @Description  Uploads personal ID user files to AWS S3 Bucket
// @ID           personalIdFiles
// @Accept       json
// @Produce      json
// @Param        input  body      command.Form  true  "Personal Id file"
// @Success      200    {object}  statusResponse
// @Failure      400    {object}  errorResponse
// @Failure      500    {object}  errorResponse
// @Router       /upload/personal [post]

func (h *Controller) personaIDUpload(c *gin.Context) {
	// waiting some magic about token parsing and basic User recognition
	var form command.Form

	if err := c.ShouldBind(&form); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	err := h.services.Upload.Create(c, form.Files, "personalId")

	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, "")
}

// @Summary      General info files upload
// @Tags         Upload
// @Description  Uploads general info user files to AWS S3 Bucket
// @ID           generalOnfoFiles
// @Accept       json
// @Produce      json
// @Param        input  body      command.Form  true  "General info file"
// @Success      200    {object}  statusResponse
// @Failure      400    {object}  errorResponse
// @Failure      500    {object}  errorResponse
// @Router       /upload/general [post]

func (h *Controller) generalUpload(c *gin.Context) {
	// waiting some magic about token parsing and basic User recognition
	var form command.Form

	if err := c.ShouldBind(&form); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	err := h.services.Upload.Create(c, form.Files, "general")

	if err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, "")
}
