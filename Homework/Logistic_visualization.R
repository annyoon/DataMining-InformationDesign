### 데이터 불러오기 ###
bank <- read.csv("bank.csv")


bank$default <- replace(bank$default, bank$default == 'yes', 1)
bank$default <- replace(bank$default, bank$default == 'no', 2)
bank$default <- replace(bank$default, bank$default == 'unknown', 3)
bank$month <- replace(bank$month, bank$month == 'apr', 4)
bank$month <- replace(bank$month, bank$month == 'aug', 8)
bank$month <- replace(bank$month, bank$month == 'dec', 12)
bank$month <- replace(bank$month, bank$month == 'jul', 7)
bank$month <- replace(bank$month, bank$month == 'jun', 6)
bank$month <- replace(bank$month, bank$month == 'mar', 3)
bank$month <- replace(bank$month, bank$month == 'may', 5)
bank$month <- replace(bank$month, bank$month == 'nov', 1)
bank$month <- replace(bank$month, bank$month == 'oct', 10)
bank$month <- replace(bank$month, bank$month == 'sep', 9)
bank$month <- replace(bank$month, bank$month == 'nov', 11)
bank$day_of_week <- replace(bank$day_of_week, bank$day_of_week == 'mon', 1)
bank$day_of_week <- replace(bank$day_of_week, bank$day_of_week == 'tue', 2)
bank$day_of_week <- replace(bank$day_of_week, bank$day_of_week == 'wed', 3)
bank$day_of_week <- replace(bank$day_of_week, bank$day_of_week == 'thu', 4)
bank$day_of_week <- replace(bank$day_of_week, bank$day_of_week == 'fri', 5)
bank$y <- replace(bank$y, bank$y == 'yes', 1)
bank$y <- replace(bank$y, bank$y == 'no', 0)
bank$poutcome <- replace(bank$poutcome, bank$poutcome == 'success', 1)
bank$poutcome <- replace(bank$poutcome, bank$poutcome == 'failure', 2)
bank$poutcome <- replace(bank$poutcome, bank$poutcome == 'nonexistent', 3)

bank <- bank[,-c(2, 3, 4, 6, 7, 8, 14, 20)]


### 데이터 전처리 ###
# bank <- bank[,-c(11)] # 상관성이 너무 큰 변수 제거
bank$pdays <- replace(bank$pdays, bank$pdays == 999, 50) # 결측치 처리

### 범주형 변수 변환 ###
# install.packages("dummies")
library(dummies)
bank <- dummy.data.frame(bank, names = c("job", "marital", "education", "default", "housing",
                                         "loan", "Fjob", "contact", "month", "day_of_week",
                                         "poutcome", "y"))
bank <- bank[,-c(26, 29, 32, 63)]

### 데이터 스케일링 ###
bank <- transform(bank, emp.var.rate = scale(bank$emp.var.rate),
                  cons.price.idx = scale(bank$cons.price.idx),
                  cons.conf.idx = scale(bank$cons.conf.idx),
                  euribor3m = scale(bank$euribor3m),
                  nr.employed = scale(bank$nr.employed)) # 표준화

normalize <- function(n){
  return((n - min(n)) / (max(n) - min(n))) # 정규화
}
bank <- transform(bank, campaign = normalize(bank$campaign),
                  previous = normalize(bank$previous))


# install.packages("corrplot")
library(corrplot) 

str(bank)
bank$default <- as.numeric(bank$default)
bank$month <- as.numeric(bank$month)
bank$day_of_week <- as.numeric(bank$day_of_week)
bank$poutcome <- as.numeric(bank$poutcome)
bank$y <- as.numeric(bank$y)
cor <- cor(bank)


corrplot(cor)
bank


plot(x = bank$campaign, y = bank$duration,
     main = "고객 연락 횟수와 연락 지속 시간의 관계", cex.main = 3,
     shape = 15, colour = "blue")
