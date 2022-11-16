package helper

import (
	"errors"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetIDFromCtx(c *gin.Context) (uint, error) {
	userID, ok := c.Get("userID")
	if !ok {
		return 0, errors.New("id's not found in context")
	}

	return userID.(uint), nil
}

func GetInvestorIDFromCtx(c *gin.Context) (uint, error) {
	InvestorID, ok := c.Get("InvestorID")
	if !ok {
		return 0, errors.New("id's not found in context")
	}

	return InvestorID.(uint), nil
}

func GetConsumerIDFromCtx(c *gin.Context) (uint, error) {
	ConsumerID, ok := c.Get("ConsumerID")
	if !ok {
		return 0, errors.New("id's not found in context")
	}

	return ConsumerID.(uint), nil
}

func Paginate(page int, pageSize int) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		offset := (page - 1) * pageSize
		return db.Offset(offset).Limit(pageSize)
	}
}

func CalculateAppFee(amount float64) float64 {
	stripeFee := amount * 2.9
	ourFee := amount * 0.5

	return stripeFee + ourFee
}

func CalculatePriceWithFee(price float64, fee float64) float64 {
	return (price*100 + fee) / (1.0 - 0.034)
}

func CalculateOneTimePayment(total float64, amount uint) (all float64, app float64) {
	payment := total / float64(amount)
	appFee := CalculateAppFee(payment)
	totalFee := CalculatePriceWithFee(payment, appFee)

	return totalFee, appFee
}
