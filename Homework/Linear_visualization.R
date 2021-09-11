### 데이터 불러오기 ###
student <- read.csv("student.csv")

### 데이터 전처리 ###
student <- student[,-c(31, 32)] # 상관성이 너무 큰 변수 제거
student <- student[,-c(1)] # 의미 없는 변수(학교) 제거

### 범주형 변수 변환 ###
# install.packages("dummies")
library(dummies)
student <- dummy.data.frame(student, names = c("school", "sex", "address", "famsize", "Pstatus",
                                               "Mjob", "Fjob", "reason", "guardian", "schoolsup",
                                               "famsup", "paid", "activities", "nursery", "higher",
                                               "internet", "romantic"))
student <- student[,-c(2, 5, 7, 9, 32, 34, 36, 38, 40, 42, 44, 46)] # 더미 변수로 인해 중복되는 컬럼 제거

### 데이터 시각화 ###
# install.packages('ggplot2')
library('ggplot2')
library(MASS)

f <- subset(student, sexF == 1)
m <- subset(student, sexF == 0)
# hist(f$G3, breaks = 15, col = "orange", main = "여학생 성적 분포")

truehist(f$G3, xlim = c(0, 20), h = 1, col = "#ff990080", border = "#ff990080",
         axes = FALSE, xlab = "", ylab = "", main = "남학생과 여학생의 성적 분포", cex.main = 3.5)
axis(side = 1)
axis(side = 2, col.axis = "#ff9900", col = "#ff9900")

par(new = TRUE)

truehist(m$G3, xlim = c(0, 20), h = 1, col = "#66990080", border = "#66990080",
         axes = FALSE, xlab = "", ylab = "")
axis(side = 4, col.axis = "#669900", col = "#669900")

legend("topright", legend=c("여학생","남학생"),fill=c("#ff990080","#66990080"),border="white",box.lty=0,cex=1.25)

circle <- table(student$Fjob)
pie(circle, main = "학생들 아버지의 직업")
# 값 입력(labels)
label <- paste(names(circle), "\n")
label
pie(circle, labels=label)

# 값(퍼센트) 입력
label <- paste(names(circle), "\n", circle/sum(circle)*100)
label
pie(circle, labels=label)

pct <- round(circle/sum(circle)*100,2)
label <- paste(names(circle), "\n", pct, "%")
pie(circle, labels=label, circle, main = "학생들 아버지의 직업", cex.main = 2, cex.lab = 2, cex = 2)

