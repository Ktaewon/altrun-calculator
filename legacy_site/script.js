// 알뜰런 유지비 계산기 - 5가지 방식 비교

class Calculator {
    constructor() {
        this.initElements();
        this.bindEvents();
        this.calculate();
    }

    initElements() {
        // 단말기 정보
        this.devicePrice = document.getElementById('devicePrice');
        this.selfPurchasePrice = document.getElementById('selfPurchasePrice');
        
        // 공통 설정
        this.totalPeriod = document.getElementById('totalPeriod');
        this.mvnoPlanCost = document.getElementById('mvnoPlanCost');
        this.usimCost = document.getElementById('usimCost');
        
        // 공시지원금 조건
        this.publicSubsidy = document.getElementById('publicSubsidy');
        this.publicExtraSubsidy = document.getElementById('publicExtraSubsidy');
        this.publicStoreSubsidy = document.getElementById('publicStoreSubsidy');
        this.publicPlanCost = document.getElementById('publicPlanCost');
        this.publicLowPlanCost = document.getElementById('publicLowPlanCost');
        this.publicMinMonths = document.getElementById('publicMinMonths');
        this.publicVasCost = document.getElementById('publicVasCost');
        this.publicVasMonths = document.getElementById('publicVasMonths');
        this.publicHighCombineDiscount = document.getElementById('publicHighCombineDiscount');
        this.publicLowCombineDiscount = document.getElementById('publicLowCombineDiscount');
        
        // 선택약정 조건
        this.selectExtraSubsidy = document.getElementById('selectExtraSubsidy');
        this.selectStoreSubsidy = document.getElementById('selectStoreSubsidy');
        this.selectPlanCost = document.getElementById('selectPlanCost');
        this.selectMinMonths = document.getElementById('selectMinMonths');
        this.selectLowPlanCost = document.getElementById('selectLowPlanCost');
        this.selectDiscountRate = document.getElementById('selectDiscountRate');
        this.selectVasCost = document.getElementById('selectVasCost');
        this.selectVasMonths = document.getElementById('selectVasMonths');
        this.selectHighCombineDiscount = document.getElementById('selectHighCombineDiscount');
        this.selectLowCombineDiscount = document.getElementById('selectLowCombineDiscount');
        this.mvnoMoveMonths = document.getElementById('mvnoMoveMonths');

        // 결과 요소들
        this.timingChart = document.getElementById('timingChart');
        this.recommendationText = document.getElementById('recommendationText');
    }

    bindEvents() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.calculate());
            input.addEventListener('change', () => this.calculate());
        });
    }

    getNumber(element) {
        return parseInt(element.value) || 0;
    }

    formatNumber(num) {
        return Math.round(num).toLocaleString('ko-KR');
    }

    calculate() {
        // 입력값 가져오기
        const devicePrice = this.getNumber(this.devicePrice);
        const selfPurchasePrice = this.getNumber(this.selfPurchasePrice);
        const totalPeriod = this.getNumber(this.totalPeriod);
        const mvnoPlanCost = this.getNumber(this.mvnoPlanCost);
        const usimCost = this.getNumber(this.usimCost);
        
        // 공시지원금 조건
        const publicSubsidy = this.getNumber(this.publicSubsidy);
        const publicExtraSubsidy = this.getNumber(this.publicExtraSubsidy);
        const publicStoreSubsidy = this.getNumber(this.publicStoreSubsidy);
        const publicPlanCost = this.getNumber(this.publicPlanCost);
        const publicLowPlanCost = this.getNumber(this.publicLowPlanCost);
        const publicMinMonths = this.getNumber(this.publicMinMonths);
        const publicVasCost = this.getNumber(this.publicVasCost);
        const publicVasMonths = this.getNumber(this.publicVasMonths);
        const publicHighCombineDiscount = this.getNumber(this.publicHighCombineDiscount);
        const publicLowCombineDiscount = this.getNumber(this.publicLowCombineDiscount);
        
        // 선택약정 조건
        const selectExtraSubsidy = this.getNumber(this.selectExtraSubsidy);
        const selectStoreSubsidy = this.getNumber(this.selectStoreSubsidy);
        const selectPlanCost = this.getNumber(this.selectPlanCost);
        const selectMinMonths = this.getNumber(this.selectMinMonths);
        const selectLowPlanCost = this.getNumber(this.selectLowPlanCost);
        const discountRate = this.getNumber(this.selectDiscountRate) / 100;
        const selectVasCost = this.getNumber(this.selectVasCost);
        const selectVasMonths = this.getNumber(this.selectVasMonths);
        const selectHighCombineDiscount = this.getNumber(this.selectHighCombineDiscount);
        const selectLowCombineDiscount = this.getNumber(this.selectLowCombineDiscount);
        const mvnoMoveMonths = this.getNumber(this.mvnoMoveMonths);

        // 방식 1: 공시지원금 (의무 유지 후 저가 요금제로 변경 가능)
        const method1 = this.calculatePublicSubsidy(
            devicePrice, publicSubsidy, publicExtraSubsidy, publicStoreSubsidy,
            publicPlanCost, publicLowPlanCost, publicMinMonths, totalPeriod, 
            publicVasCost, publicVasMonths,
            publicHighCombineDiscount, publicLowCombineDiscount
        );

        // 방식 2: 선택약정 (추가지원금 없음)
        const method2 = this.calculateSelectContract(
            devicePrice, selectStoreSubsidy, 0, selectPlanCost, selectMinMonths, 
            selectLowPlanCost, discountRate, totalPeriod, selectVasCost, selectVasMonths,
            selectHighCombineDiscount, selectLowCombineDiscount
        );

        // 방식 3: 선택약정 + 추가지원금 (고가 요금제 6개월 필수 + 24개월 유지)
        const extraSubsidyMinMonths = 6; // 추가지원금 받으려면 고가 요금제 6개월 필수
        const method3 = this.calculateSelectContract(
            devicePrice, selectStoreSubsidy, selectExtraSubsidy, selectPlanCost, extraSubsidyMinMonths, 
            selectLowPlanCost, discountRate, totalPeriod, selectVasCost, selectVasMonths,
            selectHighCombineDiscount, selectLowCombineDiscount
        );

        // 방식 4: 선택약정 + 알뜰런
        const method4 = this.calculateSelectMvno(
            devicePrice, selectStoreSubsidy, selectPlanCost, selectLowPlanCost, selectMinMonths,
            discountRate, mvnoPlanCost, mvnoMoveMonths, totalPeriod, usimCost,
            selectVasCost, selectVasMonths,
            selectHighCombineDiscount, selectLowCombineDiscount
        );

        // 방식 5: 자급제 + 알뜰폰
        const method5 = this.calculateSelfMvno(
            selfPurchasePrice, mvnoPlanCost, totalPeriod
        );

        // 결과 업데이트
        this.updateMethodCard(1, method1, totalPeriod);
        this.updateMethodCard(2, method2, totalPeriod, discountRate);
        this.updateMethodCard(3, method3, totalPeriod, discountRate, selectExtraSubsidy);
        this.updateMethodCard(4, method4, totalPeriod);
        this.updateMethodCard(5, method5, totalPeriod);

        // 순위 및 뱃지 업데이트
        this.updateRankings([method1, method2, method3, method4, method5]);

        // 절약 금액 업데이트
        const methods = [method1, method2, method3, method4, method5];
        const bestMethod = methods.reduce((min, m) => m.total < min.total ? m : min, methods[0]);
        this.updateSavings(method1, bestMethod);

        // 테이블 업데이트
        this.updateTable(method1, method2, method3, method4, method5);

        // 타이밍 차트 업데이트
        this.updateTimingChart(
            devicePrice, selectStoreSubsidy, selectPlanCost, selectLowPlanCost, selectMinMonths,
            discountRate, mvnoPlanCost, totalPeriod, usimCost, selectVasCost, selectVasMonths,
            selectHighCombineDiscount, selectLowCombineDiscount
        );

        // 설명 텍스트 업데이트
        this.updateDescriptions(totalPeriod, discountRate, mvnoMoveMonths);
    }

    // 방식 1: 공시지원금 (의무 유지 후 저가 요금제로 변경 가능)
    calculatePublicSubsidy(devicePrice, publicSubsidy, extraSubsidy, storeSubsidy, 
                           highPlanCost, lowPlanCost, minMonths, totalMonths, vasCost, vasMonths,
                           highCombineDiscount, lowCombineDiscount) {
        // 단말기 비용 = 출고가 - 공시지원금 - 추가지원금 - 판매점지원금
        const deviceCost = Math.max(0, devicePrice - publicSubsidy - extraSubsidy - storeSubsidy);
        
        // 고가 요금제 (의무 유지 기간) - 결합할인 적용
        const highPlanMonthly = highPlanCost - highCombineDiscount;
        const highPlanTotal = highPlanMonthly * minMonths;
        
        // 저가 요금제 (이후 기간) - 결합할인 적용
        const remainingMonths = Math.max(0, totalMonths - minMonths);
        const lowPlanMonthly = lowPlanCost - lowCombineDiscount;
        const lowPlanTotal = lowPlanMonthly * remainingMonths;
        
        // 결합할인 총액
        const combineDiscountTotal = (highCombineDiscount * minMonths) + (lowCombineDiscount * remainingMonths);
        
        const planTotal = highPlanTotal + lowPlanTotal;
        const vasTotal = vasCost * vasMonths;
        const total = deviceCost + planTotal + vasTotal;
        const monthly = total / totalMonths;

        return {
            device: deviceCost,
            plan: planTotal,
            highPlan: highPlanTotal,
            lowPlan: lowPlanTotal,
            highMonths: minMonths,
            lowMonths: remainingMonths,
            vas: vasTotal,
            vasMonths: vasMonths,
            combineDiscount: combineDiscountTotal,
            penalty: 0,
            usim: 0,
            total,
            monthly
        };
    }

    // 방식 2, 3: 선택약정 (의무 유지 후 저가 요금제로 변경)
    calculateSelectContract(devicePrice, storeSubsidy, extraSubsidy, highPlanCost, minMonths, lowPlanCost, 
                            discountRate, totalMonths, vasCost, vasMonths,
                            highCombineDiscount, lowCombineDiscount) {
        // 단말기 비용 = 출고가 - 판매점지원금 - 추가지원금
        const deviceCost = Math.max(0, devicePrice - storeSubsidy - extraSubsidy);
        
        // 의무 유지 기간: 고가 요금제 (할인 적용 + 결합할인)
        const discountedHighPlan = highPlanCost * (1 - discountRate) - highCombineDiscount;
        const highPlanTotal = discountedHighPlan * minMonths;
        
        // 이후 기간: 저가 요금제 (할인 적용 + 결합할인)
        const remainingMonths = Math.max(0, totalMonths - minMonths);
        const discountedLowPlan = lowPlanCost * (1 - discountRate) - lowCombineDiscount;
        const lowPlanTotal = discountedLowPlan * remainingMonths;
        
        // 결합할인 총액
        const combineDiscountTotal = (highCombineDiscount * minMonths) + (lowCombineDiscount * remainingMonths);
        
        const planTotal = highPlanTotal + lowPlanTotal;
        const vasTotal = vasCost * vasMonths;
        const total = deviceCost + planTotal + vasTotal;
        const monthly = total / totalMonths;

        return {
            device: deviceCost,
            extraSubsidy: extraSubsidy,
            plan: planTotal,
            highPlan: highPlanTotal,
            lowPlan: lowPlanTotal,
            highMonths: minMonths,
            lowMonths: remainingMonths,
            vas: vasTotal,
            vasMonths: vasMonths,
            combineDiscount: combineDiscountTotal,
            discountedHighMonthly: discountedHighPlan,
            discountedLowMonthly: discountedLowPlan,
            penalty: 0,
            usim: 0,
            total,
            monthly
        };
    }

    // 방식 3: 선택약정 + 알뜰런
    calculateSelectMvno(devicePrice, storeSubsidy, highPlanCost, lowPlanCost, minMonths,
                        discountRate, mvnoPlan, moveMonths, totalMonths, usimCost, vasCost, vasMonths,
                        highCombineDiscount, lowCombineDiscount) {
        // 단말기 비용 = 출고가 - 판매점지원금
        const deviceCost = Math.max(0, devicePrice - storeSubsidy);
        
        // 의무 유지 기간 동안: 고가 요금제 (할인 적용 + 결합할인)
        const discountedHighPlan = highPlanCost * (1 - discountRate) - highCombineDiscount;
        const highPlanMonths = Math.min(minMonths, moveMonths);
        const highPlanTotal = discountedHighPlan * highPlanMonths;
        
        // 의무 유지 이후 ~ 알뜰런 이동까지: 저가 요금제 (할인 적용 + 결합할인)
        const discountedLowPlan = lowPlanCost * (1 - discountRate) - lowCombineDiscount;
        const lowPlanMonths = Math.max(0, moveMonths - minMonths);
        const lowPlanTotal = discountedLowPlan * lowPlanMonths;
        
        // 결합할인 총액 (알뜰폰 기간에는 결합할인 없음)
        const combineDiscountTotal = (highCombineDiscount * highPlanMonths) + (lowCombineDiscount * lowPlanMonths);
        
        const carrierTotal = highPlanTotal + lowPlanTotal;
        
        // 알뜰폰 기간 (결합할인 없음)
        const mvnoMonths = totalMonths - moveMonths;
        const mvnoTotal = mvnoPlan * mvnoMonths;
        
        // 부가서비스 (알뜰폰 이동 전까지만 유지)
        const actualVasMonths = Math.min(vasMonths, moveMonths);
        const vasTotal = vasCost * actualVasMonths;
        
        // 선택약정 반환금 계산 (유지 기간 동안 할인받은 금액 반환)
        const highPlanDiscount = highPlanCost * discountRate * highPlanMonths;
        const lowPlanDiscount = lowPlanCost * discountRate * lowPlanMonths;
        const penalty = highPlanDiscount + lowPlanDiscount;

        const total = deviceCost + carrierTotal + mvnoTotal + vasTotal + penalty + usimCost;
        const monthly = total / totalMonths;

        return {
            device: deviceCost,
            carrier: carrierTotal,
            highPlan: highPlanTotal,
            lowPlan: lowPlanTotal,
            highPlanMonths,
            lowPlanMonths,
            mvno: mvnoTotal,
            plan: carrierTotal + mvnoTotal,
            vas: vasTotal,
            vasMonths: actualVasMonths,
            combineDiscount: combineDiscountTotal,
            penalty,
            usim: usimCost,
            total,
            monthly,
            carrierMonths: moveMonths,
            mvnoMonths
        };
    }

    // 방식 4: 자급제 + 알뜰폰
    calculateSelfMvno(devicePrice, mvnoPlan, months) {
        const deviceCost = devicePrice;
        const planTotal = mvnoPlan * months;
        const total = deviceCost + planTotal;
        const monthly = total / months;

        return {
            device: deviceCost,
            plan: planTotal,
            penalty: 0,
            usim: 0,
            vas: 0,
            vasMonths: 0,
            total,
            monthly
        };
    }

    updateMethodCard(num, data, totalPeriod, discountRate, extraSubsidy) {
        document.getElementById(`method${num}Total`).textContent = `${this.formatNumber(data.total)}원`;
        document.getElementById(`method${num}Monthly`).textContent = `${this.formatNumber(data.monthly)}원`;
        document.getElementById(`method${num}Device`).textContent = `${this.formatNumber(data.device)}원`;

        if (num === 1) {
            document.getElementById('method1HighMonths').textContent = data.highMonths;
            document.getElementById('method1LowMonths').textContent = data.lowMonths;
            document.getElementById('method1HighPlan').textContent = `${this.formatNumber(data.highPlan)}원`;
            document.getElementById('method1LowPlan').textContent = `${this.formatNumber(data.lowPlan)}원`;
            document.getElementById('method1VasMonths').textContent = data.vasMonths;
            document.getElementById('method1Vas').textContent = `${this.formatNumber(data.vas)}원`;
        } else if (num === 2) {
            document.getElementById('method2HighMonths').textContent = data.highMonths;
            document.getElementById('method2LowMonths').textContent = data.lowMonths;
            document.getElementById('method2HighPlan').textContent = `${this.formatNumber(data.highPlan)}원`;
            document.getElementById('method2LowPlan').textContent = `${this.formatNumber(data.lowPlan)}원`;
            document.getElementById('method2VasMonths').textContent = data.vasMonths;
            document.getElementById('method2Vas').textContent = `${this.formatNumber(data.vas)}원`;
        } else if (num === 3) {
            // 선택약정 + 추가지원금
            document.getElementById('method3ExtraSubsidy').textContent = `-${this.formatNumber(extraSubsidy)}원`;
            document.getElementById('method3HighMonths').textContent = data.highMonths;
            document.getElementById('method3LowMonths').textContent = data.lowMonths;
            document.getElementById('method3HighPlan').textContent = `${this.formatNumber(data.highPlan)}원`;
            document.getElementById('method3LowPlan').textContent = `${this.formatNumber(data.lowPlan)}원`;
            document.getElementById('method3VasMonths').textContent = data.vasMonths;
            document.getElementById('method3Vas').textContent = `${this.formatNumber(data.vas)}원`;
        } else if (num === 4) {
            // 선택약정 + 알뜰런
            document.getElementById('method4HighMonths').textContent = data.highPlanMonths;
            document.getElementById('method4LowMonths').textContent = data.lowPlanMonths;
            document.getElementById('method4HighPlan').textContent = `${this.formatNumber(data.highPlan)}원`;
            document.getElementById('method4LowPlan').textContent = `${this.formatNumber(data.lowPlan)}원`;
            document.getElementById('method4MvnoMonths').textContent = data.mvnoMonths;
            document.getElementById('method4Mvno').textContent = `${this.formatNumber(data.mvno)}원`;
            document.getElementById('method4VasMonths').textContent = data.vasMonths;
            document.getElementById('method4Vas').textContent = `${this.formatNumber(data.vas)}원`;
            document.getElementById('method4Penalty').textContent = `${this.formatNumber(data.penalty)}원`;
            document.getElementById('method4Usim').textContent = `${this.formatNumber(data.usim)}원`;
            // 저가 요금제 행 표시/숨김
            document.getElementById('method4LowPlanRow').style.display = data.lowPlanMonths > 0 ? 'flex' : 'none';
        } else if (num === 5) {
            // 자급제 + 알뜰폰
            document.getElementById('method5PlanMonths').textContent = totalPeriod;
            document.getElementById('method5Plan').textContent = `${this.formatNumber(data.plan)}원`;
        }
    }

    updateDescriptions(totalPeriod, discountRate, mvnoMoveMonths) {
        document.getElementById('method1Desc').textContent = 
            `공시지원금 + ${totalPeriod}개월 유지`;
        document.getElementById('method2Desc').textContent = 
            `선택약정 ${Math.round(discountRate * 100)}% 할인 + ${totalPeriod}개월 유지`;
        document.getElementById('method3Desc').textContent = 
            `선택약정 ${Math.round(discountRate * 100)}% + 추가지원금 (고가 6개월 필수) + ${totalPeriod}개월`;
        document.getElementById('monthsDisplay').textContent = mvnoMoveMonths;
    }

    updateRankings(methods) {
        // 순위 계산
        const sorted = methods.map((m, i) => ({ index: i + 1, total: m.total }))
            .sort((a, b) => a.total - b.total);

        const ranks = {};
        sorted.forEach((item, rank) => {
            ranks[item.index] = rank + 1;
        });

        // 뱃지 설정
        const badgeConfigs = {
            1: { class: 'badge-primary', text: '최저가' },
            2: { class: 'badge-success', text: '추천' },
            3: { class: 'badge-warning', text: '보통' },
            4: { class: 'badge-warning', text: '보통' },
            5: { class: 'badge-danger', text: '비추천' }
        };

        const cards = document.querySelectorAll('.method-card');

        cards.forEach((card, i) => {
            const rank = ranks[i + 1];
            const rankEl = document.getElementById(`rank${i + 1}`);
            const badgeEl = document.getElementById(`badge${i + 1}`);
            
            rankEl.textContent = rank;

            // 뱃지 클래스 및 텍스트 업데이트
            const config = badgeConfigs[rank];
            badgeEl.className = `method-badge ${config.class}`;
            badgeEl.textContent = config.text;

            // best/featured 클래스 업데이트
            card.classList.remove('best', 'featured');
            if (rank === 1) {
                card.classList.add('best');
            } else if (rank === 2) {
                card.classList.add('featured');
            }
        });

        // 최적 방식 업데이트
        const bestIndex = sorted[0].index;
        const methodNames = ['공시지원금', '선택약정', '선택약정+추가지원금', '선택약정+알뜰런', '자급제+알뜰폰'];
        document.getElementById('bestMethod').textContent = methodNames[bestIndex - 1];
    }

    updateSavings(method1, bestMethod) {
        const savings = method1.total - bestMethod.total;
        const savingsPercent = method1.total > 0 ? (savings / method1.total) * 100 : 0;

        document.getElementById('savingsVsPublic').textContent = `${this.formatNumber(savings)}원`;
        document.getElementById('savingsPercent').textContent = `${savingsPercent.toFixed(1)}%`;
    }

    updateTable(m1, m2, m3, m4, m5) {
        // 방식 1: 공시지원금
        document.getElementById('table1Device').textContent = `${this.formatNumber(m1.device)}원`;
        document.getElementById('table1Plan').textContent = `${this.formatNumber(m1.plan + m1.vas)}원`;
        document.getElementById('table1Penalty').textContent = `${this.formatNumber(m1.penalty)}원`;
        document.getElementById('table1Total').textContent = `${this.formatNumber(m1.total)}원`;
        document.getElementById('table1Monthly').textContent = `${this.formatNumber(m1.monthly)}원`;

        // 방식 2: 선택약정
        document.getElementById('table2Device').textContent = `${this.formatNumber(m2.device)}원`;
        document.getElementById('table2Plan').textContent = `${this.formatNumber(m2.plan + m2.vas)}원`;
        document.getElementById('table2Penalty').textContent = `${this.formatNumber(m2.penalty)}원`;
        document.getElementById('table2Total').textContent = `${this.formatNumber(m2.total)}원`;
        document.getElementById('table2Monthly').textContent = `${this.formatNumber(m2.monthly)}원`;

        // 방식 3: 선택약정 + 추가지원금
        document.getElementById('table3Device').textContent = `${this.formatNumber(m3.device)}원`;
        document.getElementById('table3Plan').textContent = `${this.formatNumber(m3.plan + m3.vas)}원`;
        document.getElementById('table3Penalty').textContent = `${this.formatNumber(m3.penalty)}원`;
        document.getElementById('table3Total').textContent = `${this.formatNumber(m3.total)}원`;
        document.getElementById('table3Monthly').textContent = `${this.formatNumber(m3.monthly)}원`;

        // 방식 4: 선택약정 + 알뜰런
        document.getElementById('table4Device').textContent = `${this.formatNumber(m4.device)}원`;
        document.getElementById('table4Plan').textContent = `${this.formatNumber(m4.plan + m4.vas)}원`;
        document.getElementById('table4Penalty').textContent = `${this.formatNumber(m4.penalty + m4.usim)}원`;
        document.getElementById('table4Total').textContent = `${this.formatNumber(m4.total)}원`;
        document.getElementById('table4Monthly').textContent = `${this.formatNumber(m4.monthly)}원`;

        // 방식 5: 자급제 + 알뜰폰
        document.getElementById('table5Device').textContent = `${this.formatNumber(m5.device)}원`;
        document.getElementById('table5Plan').textContent = `${this.formatNumber(m5.plan)}원`;
        document.getElementById('table5Penalty').textContent = `${this.formatNumber(m5.penalty)}원`;
        document.getElementById('table5Total').textContent = `${this.formatNumber(m5.total)}원`;
        document.getElementById('table5Monthly').textContent = `${this.formatNumber(m5.monthly)}원`;
    }

    updateTimingChart(devicePrice, storeSubsidy, highPlanCost, lowPlanCost, minMonths,
                      discountRate, mvnoPlan, totalPeriod, usimCost, vasCost, vasMonths,
                      highCombineDiscount, lowCombineDiscount) {
        let costs = [];
        let minCost = Infinity;
        let optimalMonth = 1;

        // 1~12개월까지 분석
        for (let month = 1; month <= 12; month++) {
            const result = this.calculateSelectMvno(
                devicePrice, storeSubsidy, highPlanCost, lowPlanCost, minMonths,
                discountRate, mvnoPlan, month, totalPeriod, usimCost, vasCost, vasMonths,
                highCombineDiscount, lowCombineDiscount
            );
            
            costs.push({
                month,
                total: result.total,
                monthly: result.monthly
            });

            // 최저 비용 찾기
            if (result.total < minCost) {
                minCost = result.total;
                optimalMonth = month;
            }
        }

        // 차트 렌더링
        this.timingChart.innerHTML = costs.map((cost) => {
            let className = 'timing-bar';
            
            if (cost.month === optimalMonth) {
                className += ' optimal';
            } else if (Math.abs(cost.total - minCost) < minCost * 0.02) {
                // 최저가의 2% 이내면 good
                className += ' good';
            }

            return `
                <div class="${className}" 
                     onclick="document.getElementById('mvnoMoveMonths').value=${cost.month}; document.getElementById('mvnoMoveMonths').dispatchEvent(new Event('input'));"
                     title="${cost.month}개월 유지 시 총 ${this.formatNumber(cost.total)}원 (월 ${this.formatNumber(cost.monthly)}원)">
                    <span class="month">${cost.month}개월</span>
                    <span class="cost">${Math.round(cost.monthly / 1000)}K</span>
                </div>
            `;
        }).join('');

        // 추천 텍스트 업데이트
        const optimalData = costs[optimalMonth - 1];
        this.recommendationText.textContent = 
            `${optimalMonth}개월 유지 후 알뜰폰 이동이 가장 효율적입니다. ` +
            `(총 ${this.formatNumber(optimalData.total)}원, 월 평균 ${this.formatNumber(optimalData.monthly)}원)`;
    }

    // 상세보기 모달 표시
    showDetailModal(methodNum) {
        const modal = document.getElementById('detailModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalTotal = document.getElementById('modalTotal');
        const modalMonthly = document.getElementById('modalMonthly');

        const methodNames = [
            '공시지원금',
            '선택약정',
            '선택약정 + 추가지원금',
            '선택약정 + 알뜰런',
            '자급제 + 알뜰폰'
        ];

        modalTitle.textContent = `${methodNames[methodNum - 1]} 상세 내역`;

        // 상세 내역 생성
        const content = this.generateDetailContent(methodNum);
        modalBody.innerHTML = content.html;
        modalTotal.textContent = `${this.formatNumber(content.total)}원`;
        modalMonthly.textContent = `${this.formatNumber(content.monthly)}원`;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('detailModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    generateDetailContent(methodNum) {
        const totalPeriod = this.getNumber(this.totalPeriod);
        
        if (methodNum === 1) {
            return this.generateMethod1Detail(totalPeriod);
        } else if (methodNum === 2) {
            return this.generateMethod2Detail(totalPeriod);
        } else if (methodNum === 3) {
            return this.generateMethod3Detail(totalPeriod);
        } else if (methodNum === 4) {
            return this.generateMethod4Detail(totalPeriod);
        } else {
            return this.generateMethod5Detail(totalPeriod);
        }
    }

    // 방식 1: 공시지원금 상세
    generateMethod1Detail(totalPeriod) {
        const devicePrice = this.getNumber(this.devicePrice);
        const publicSubsidy = this.getNumber(this.publicSubsidy);
        const publicExtraSubsidy = this.getNumber(this.publicExtraSubsidy);
        const publicStoreSubsidy = this.getNumber(this.publicStoreSubsidy);
        const publicPlanCost = this.getNumber(this.publicPlanCost);
        const publicLowPlanCost = this.getNumber(this.publicLowPlanCost);
        const publicMinMonths = this.getNumber(this.publicMinMonths);
        const publicVasCost = this.getNumber(this.publicVasCost);
        const publicVasMonths = this.getNumber(this.publicVasMonths);
        const publicHighCombine = this.getNumber(this.publicHighCombineDiscount);
        const publicLowCombine = this.getNumber(this.publicLowCombineDiscount);

        const deviceCost = Math.max(0, devicePrice - publicSubsidy - publicExtraSubsidy - publicStoreSubsidy);
        const highPlanMonthly = publicPlanCost - publicHighCombine;
        const highPlanTotal = highPlanMonthly * publicMinMonths;
        const lowMonths = totalPeriod - publicMinMonths;
        const lowPlanMonthly = publicLowPlanCost - publicLowCombine;
        const lowPlanTotal = lowPlanMonthly * lowMonths;
        const vasTotal = publicVasCost * publicVasMonths;
        const total = deviceCost + highPlanTotal + lowPlanTotal + vasTotal;

        const html = `
            <div class="modal-section">
                <div class="modal-section-title">📱 단말기 비용</div>
                <div class="modal-row">
                    <span class="modal-row-label">출고가</span>
                    <span class="modal-row-value">${this.formatNumber(devicePrice)}원</span>
                </div>
                <div class="modal-row discount">
                    <span class="modal-row-label">공시지원금</span>
                    <span class="modal-row-value">-${this.formatNumber(publicSubsidy)}원</span>
                </div>
                <div class="modal-row discount">
                    <span class="modal-row-label">추가지원금</span>
                    <span class="modal-row-value">-${this.formatNumber(publicExtraSubsidy)}원</span>
                </div>
                <div class="modal-row discount">
                    <span class="modal-row-label">판매점 지원금</span>
                    <span class="modal-row-value">-${this.formatNumber(publicStoreSubsidy)}원</span>
                </div>
                <div class="modal-row subtotal">
                    <span class="modal-row-label">단말기 실구매가</span>
                    <span class="modal-row-value">${this.formatNumber(deviceCost)}원</span>
                </div>
            </div>

            <div class="modal-section">
                <div class="modal-section-title">📶 요금제 비용 (${totalPeriod}개월)</div>
                <div class="modal-row">
                    <span class="modal-row-label">고가 요금제 (${publicMinMonths}개월)</span>
                    <span class="modal-row-value">${this.formatNumber(highPlanTotal)}원<span class="modal-row-calc">${this.formatNumber(highPlanMonthly)}원×${publicMinMonths}</span></span>
                </div>
                ${publicHighCombine > 0 ? `
                <div class="modal-row discount">
                    <span class="modal-row-label">└ 결합할인 적용</span>
                    <span class="modal-row-value">-${this.formatNumber(publicHighCombine)}원/월</span>
                </div>` : ''}
                <div class="modal-row">
                    <span class="modal-row-label">저가 요금제 (${lowMonths}개월)</span>
                    <span class="modal-row-value">${this.formatNumber(lowPlanTotal)}원<span class="modal-row-calc">${this.formatNumber(lowPlanMonthly)}원×${lowMonths}</span></span>
                </div>
                ${publicLowCombine > 0 ? `
                <div class="modal-row discount">
                    <span class="modal-row-label">└ 결합할인 적용</span>
                    <span class="modal-row-value">-${this.formatNumber(publicLowCombine)}원/월</span>
                </div>` : ''}
                <div class="modal-row subtotal">
                    <span class="modal-row-label">요금제 소계</span>
                    <span class="modal-row-value">${this.formatNumber(highPlanTotal + lowPlanTotal)}원</span>
                </div>
            </div>

            ${publicVasMonths > 0 ? `
            <div class="modal-section">
                <div class="modal-section-title">➕ 부가서비스</div>
                <div class="modal-row">
                    <span class="modal-row-label">부가서비스 (${publicVasMonths}개월)</span>
                    <span class="modal-row-value">${this.formatNumber(vasTotal)}원<span class="modal-row-calc">${this.formatNumber(publicVasCost)}원×${publicVasMonths}</span></span>
                </div>
            </div>` : ''}
        `;

        return { html, total, monthly: total / totalPeriod };
    }

    // 방식 2: 선택약정 상세
    generateMethod2Detail(totalPeriod) {
        const devicePrice = this.getNumber(this.devicePrice);
        const selectStoreSubsidy = this.getNumber(this.selectStoreSubsidy);
        const selectPlanCost = this.getNumber(this.selectPlanCost);
        const selectLowPlanCost = this.getNumber(this.selectLowPlanCost);
        const selectMinMonths = this.getNumber(this.selectMinMonths);
        const discountRate = this.getNumber(this.selectDiscountRate) / 100;
        const selectVasCost = this.getNumber(this.selectVasCost);
        const selectVasMonths = this.getNumber(this.selectVasMonths);
        const selectHighCombine = this.getNumber(this.selectHighCombineDiscount);
        const selectLowCombine = this.getNumber(this.selectLowCombineDiscount);

        const deviceCost = Math.max(0, devicePrice - selectStoreSubsidy);
        const discountedHigh = selectPlanCost * (1 - discountRate) - selectHighCombine;
        const highPlanTotal = discountedHigh * selectMinMonths;
        const lowMonths = totalPeriod - selectMinMonths;
        const discountedLow = selectLowPlanCost * (1 - discountRate) - selectLowCombine;
        const lowPlanTotal = discountedLow * lowMonths;
        const vasTotal = selectVasCost * selectVasMonths;
        const total = deviceCost + highPlanTotal + lowPlanTotal + vasTotal;

        const html = `
            <div class="modal-section">
                <div class="modal-section-title">📱 단말기 비용</div>
                <div class="modal-row">
                    <span class="modal-row-label">출고가</span>
                    <span class="modal-row-value">${this.formatNumber(devicePrice)}원</span>
                </div>
                <div class="modal-row discount">
                    <span class="modal-row-label">판매점 지원금</span>
                    <span class="modal-row-value">-${this.formatNumber(selectStoreSubsidy)}원</span>
                </div>
                <div class="modal-row subtotal">
                    <span class="modal-row-label">단말기 실구매가</span>
                    <span class="modal-row-value">${this.formatNumber(deviceCost)}원</span>
                </div>
            </div>

            <div class="modal-section">
                <div class="modal-section-title">📶 요금제 비용 (선택약정 ${Math.round(discountRate*100)}% 할인)</div>
                <div class="modal-row">
                    <span class="modal-row-label">고가 요금제 원가</span>
                    <span class="modal-row-value">${this.formatNumber(selectPlanCost)}원/월</span>
                </div>
                <div class="modal-row discount">
                    <span class="modal-row-label">└ 선택약정 할인</span>
                    <span class="modal-row-value">-${this.formatNumber(selectPlanCost * discountRate)}원/월</span>
                </div>
                ${selectHighCombine > 0 ? `
                <div class="modal-row discount">
                    <span class="modal-row-label">└ 결합할인</span>
                    <span class="modal-row-value">-${this.formatNumber(selectHighCombine)}원/월</span>
                </div>` : ''}
                <div class="modal-row">
                    <span class="modal-row-label">→ 실납부액 (${selectMinMonths}개월)</span>
                    <span class="modal-row-value">${this.formatNumber(highPlanTotal)}원<span class="modal-row-calc">${this.formatNumber(discountedHigh)}원×${selectMinMonths}</span></span>
                </div>
                <div class="modal-row">
                    <span class="modal-row-label">저가 요금제 (${lowMonths}개월)</span>
                    <span class="modal-row-value">${this.formatNumber(lowPlanTotal)}원<span class="modal-row-calc">${this.formatNumber(discountedLow)}원×${lowMonths}</span></span>
                </div>
                <div class="modal-row subtotal">
                    <span class="modal-row-label">요금제 소계</span>
                    <span class="modal-row-value">${this.formatNumber(highPlanTotal + lowPlanTotal)}원</span>
                </div>
            </div>

            ${selectVasMonths > 0 ? `
            <div class="modal-section">
                <div class="modal-section-title">➕ 부가서비스</div>
                <div class="modal-row">
                    <span class="modal-row-label">부가서비스 (${selectVasMonths}개월)</span>
                    <span class="modal-row-value">${this.formatNumber(vasTotal)}원<span class="modal-row-calc">${this.formatNumber(selectVasCost)}원×${selectVasMonths}</span></span>
                </div>
            </div>` : ''}
        `;

        return { html, total, monthly: total / totalPeriod };
    }

    // 방식 3: 선택약정 + 추가지원금 상세
    generateMethod3Detail(totalPeriod) {
        const devicePrice = this.getNumber(this.devicePrice);
        const selectExtraSubsidy = this.getNumber(this.selectExtraSubsidy);
        const selectStoreSubsidy = this.getNumber(this.selectStoreSubsidy);
        const selectPlanCost = this.getNumber(this.selectPlanCost);
        const selectLowPlanCost = this.getNumber(this.selectLowPlanCost);
        const extraSubsidyMinMonths = 6; // 고가 요금제 6개월 필수
        const discountRate = this.getNumber(this.selectDiscountRate) / 100;
        const selectVasCost = this.getNumber(this.selectVasCost);
        const selectVasMonths = this.getNumber(this.selectVasMonths);
        const selectHighCombine = this.getNumber(this.selectHighCombineDiscount);
        const selectLowCombine = this.getNumber(this.selectLowCombineDiscount);

        const deviceCost = Math.max(0, devicePrice - selectStoreSubsidy - selectExtraSubsidy);
        const discountedHigh = selectPlanCost * (1 - discountRate) - selectHighCombine;
        const highPlanTotal = discountedHigh * extraSubsidyMinMonths;
        const lowMonths = totalPeriod - extraSubsidyMinMonths;
        const discountedLow = selectLowPlanCost * (1 - discountRate) - selectLowCombine;
        const lowPlanTotal = discountedLow * lowMonths;
        const vasTotal = selectVasCost * selectVasMonths;
        const total = deviceCost + highPlanTotal + lowPlanTotal + vasTotal;

        const html = `
            <div class="modal-section">
                <div class="modal-section-title">📱 단말기 비용</div>
                <div class="modal-row">
                    <span class="modal-row-label">출고가</span>
                    <span class="modal-row-value">${this.formatNumber(devicePrice)}원</span>
                </div>
                <div class="modal-row discount">
                    <span class="modal-row-label">추가지원금 ⚠️</span>
                    <span class="modal-row-value">-${this.formatNumber(selectExtraSubsidy)}원</span>
                </div>
                <div class="modal-row discount">
                    <span class="modal-row-label">판매점 지원금</span>
                    <span class="modal-row-value">-${this.formatNumber(selectStoreSubsidy)}원</span>
                </div>
                <div class="modal-row subtotal">
                    <span class="modal-row-label">단말기 실구매가</span>
                    <span class="modal-row-value">${this.formatNumber(deviceCost)}원</span>
                </div>
            </div>

            <div class="modal-section">
                <div class="modal-section-title">⚠️ 추가지원금 조건</div>
                <div class="modal-row">
                    <span class="modal-row-label">고가 요금제 필수 유지</span>
                    <span class="modal-row-value">6개월</span>
                </div>
                <div class="modal-row">
                    <span class="modal-row-label">총 유지 기간</span>
                    <span class="modal-row-value">24개월</span>
                </div>
            </div>

            <div class="modal-section">
                <div class="modal-section-title">📶 요금제 비용 (선택약정 ${Math.round(discountRate*100)}% 할인)</div>
                <div class="modal-row">
                    <span class="modal-row-label">고가 요금제 (${extraSubsidyMinMonths}개월, 필수)</span>
                    <span class="modal-row-value">${this.formatNumber(highPlanTotal)}원<span class="modal-row-calc">${this.formatNumber(discountedHigh)}원×${extraSubsidyMinMonths}</span></span>
                </div>
                <div class="modal-row">
                    <span class="modal-row-label">저가 요금제 (${lowMonths}개월)</span>
                    <span class="modal-row-value">${this.formatNumber(lowPlanTotal)}원<span class="modal-row-calc">${this.formatNumber(discountedLow)}원×${lowMonths}</span></span>
                </div>
                <div class="modal-row subtotal">
                    <span class="modal-row-label">요금제 소계</span>
                    <span class="modal-row-value">${this.formatNumber(highPlanTotal + lowPlanTotal)}원</span>
                </div>
            </div>

            ${selectVasMonths > 0 ? `
            <div class="modal-section">
                <div class="modal-section-title">➕ 부가서비스</div>
                <div class="modal-row">
                    <span class="modal-row-label">부가서비스 (${selectVasMonths}개월)</span>
                    <span class="modal-row-value">${this.formatNumber(vasTotal)}원<span class="modal-row-calc">${this.formatNumber(selectVasCost)}원×${selectVasMonths}</span></span>
                </div>
            </div>` : ''}
        `;

        return { html, total, monthly: total / totalPeriod };
    }

    // 방식 4: 선택약정 + 알뜰런 상세
    generateMethod4Detail(totalPeriod) {
        const devicePrice = this.getNumber(this.devicePrice);
        const selectStoreSubsidy = this.getNumber(this.selectStoreSubsidy);
        const selectPlanCost = this.getNumber(this.selectPlanCost);
        const selectLowPlanCost = this.getNumber(this.selectLowPlanCost);
        const selectMinMonths = this.getNumber(this.selectMinMonths);
        const mvnoMoveMonths = this.getNumber(this.mvnoMoveMonths);
        const discountRate = this.getNumber(this.selectDiscountRate) / 100;
        const mvnoPlanCost = this.getNumber(this.mvnoPlanCost);
        const usimCost = this.getNumber(this.usimCost);
        const selectVasCost = this.getNumber(this.selectVasCost);
        const selectVasMonths = this.getNumber(this.selectVasMonths);
        const selectHighCombine = this.getNumber(this.selectHighCombineDiscount);
        const selectLowCombine = this.getNumber(this.selectLowCombineDiscount);

        const deviceCost = Math.max(0, devicePrice - selectStoreSubsidy);
        const highPlanMonths = Math.min(selectMinMonths, mvnoMoveMonths);
        const discountedHigh = selectPlanCost * (1 - discountRate) - selectHighCombine;
        const highPlanTotal = discountedHigh * highPlanMonths;
        const lowPlanMonths = Math.max(0, mvnoMoveMonths - selectMinMonths);
        const discountedLow = selectLowPlanCost * (1 - discountRate) - selectLowCombine;
        const lowPlanTotal = discountedLow * lowPlanMonths;
        const mvnoMonths = totalPeriod - mvnoMoveMonths;
        const mvnoTotal = mvnoPlanCost * mvnoMonths;
        const actualVasMonths = Math.min(selectVasMonths, mvnoMoveMonths);
        const vasTotal = selectVasCost * actualVasMonths;
        
        const highPlanDiscount = selectPlanCost * discountRate * highPlanMonths;
        const lowPlanDiscount = selectLowPlanCost * discountRate * lowPlanMonths;
        const penalty = highPlanDiscount + lowPlanDiscount;
        
        const total = deviceCost + highPlanTotal + lowPlanTotal + mvnoTotal + vasTotal + penalty + usimCost;

        const html = `
            <div class="modal-section">
                <div class="modal-section-title">📱 단말기 비용</div>
                <div class="modal-row">
                    <span class="modal-row-label">출고가</span>
                    <span class="modal-row-value">${this.formatNumber(devicePrice)}원</span>
                </div>
                <div class="modal-row discount">
                    <span class="modal-row-label">판매점 지원금</span>
                    <span class="modal-row-value">-${this.formatNumber(selectStoreSubsidy)}원</span>
                </div>
                <div class="modal-row subtotal">
                    <span class="modal-row-label">단말기 실구매가</span>
                    <span class="modal-row-value">${this.formatNumber(deviceCost)}원</span>
                </div>
            </div>

            <div class="modal-section">
                <div class="modal-section-title">📶 통신사 요금제 (${mvnoMoveMonths}개월)</div>
                ${highPlanMonths > 0 ? `
                <div class="modal-row">
                    <span class="modal-row-label">고가 요금제 (${highPlanMonths}개월)</span>
                    <span class="modal-row-value">${this.formatNumber(highPlanTotal)}원<span class="modal-row-calc">${this.formatNumber(discountedHigh)}원×${highPlanMonths}</span></span>
                </div>` : ''}
                ${lowPlanMonths > 0 ? `
                <div class="modal-row">
                    <span class="modal-row-label">저가 요금제 (${lowPlanMonths}개월)</span>
                    <span class="modal-row-value">${this.formatNumber(lowPlanTotal)}원<span class="modal-row-calc">${this.formatNumber(discountedLow)}원×${lowPlanMonths}</span></span>
                </div>` : ''}
            </div>

            <div class="modal-section">
                <div class="modal-section-title">📱 알뜰폰 요금제 (${mvnoMonths}개월)</div>
                <div class="modal-row">
                    <span class="modal-row-label">알뜰폰 요금</span>
                    <span class="modal-row-value">${this.formatNumber(mvnoTotal)}원<span class="modal-row-calc">${this.formatNumber(mvnoPlanCost)}원×${mvnoMonths}</span></span>
                </div>
                <div class="modal-row">
                    <span class="modal-row-label">유심비</span>
                    <span class="modal-row-value">${this.formatNumber(usimCost)}원</span>
                </div>
            </div>

            <div class="modal-section">
                <div class="modal-section-title">⚠️ 선택약정 반환금</div>
                <div class="modal-row">
                    <span class="modal-row-label">고가 요금제 할인 반환</span>
                    <span class="modal-row-value">${this.formatNumber(highPlanDiscount)}원<span class="modal-row-calc">${this.formatNumber(selectPlanCost * discountRate)}원×${highPlanMonths}</span></span>
                </div>
                ${lowPlanMonths > 0 ? `
                <div class="modal-row">
                    <span class="modal-row-label">저가 요금제 할인 반환</span>
                    <span class="modal-row-value">${this.formatNumber(lowPlanDiscount)}원<span class="modal-row-calc">${this.formatNumber(selectLowPlanCost * discountRate)}원×${lowPlanMonths}</span></span>
                </div>` : ''}
                <div class="modal-row subtotal penalty">
                    <span class="modal-row-label">반환금 합계</span>
                    <span class="modal-row-value">${this.formatNumber(penalty)}원</span>
                </div>
            </div>

            ${actualVasMonths > 0 ? `
            <div class="modal-section">
                <div class="modal-section-title">➕ 부가서비스</div>
                <div class="modal-row">
                    <span class="modal-row-label">부가서비스 (${actualVasMonths}개월)</span>
                    <span class="modal-row-value">${this.formatNumber(vasTotal)}원<span class="modal-row-calc">${this.formatNumber(selectVasCost)}원×${actualVasMonths}</span></span>
                </div>
            </div>` : ''}
        `;

        return { html, total, monthly: total / totalPeriod };
    }

    // 방식 5: 자급제 + 알뜰폰 상세
    generateMethod5Detail(totalPeriod) {
        const selfPurchasePrice = this.getNumber(this.selfPurchasePrice);
        const mvnoPlanCost = this.getNumber(this.mvnoPlanCost);
        const usimCost = this.getNumber(this.usimCost);

        const planTotal = mvnoPlanCost * totalPeriod;
        const total = selfPurchasePrice + planTotal + usimCost;

        const html = `
            <div class="modal-section">
                <div class="modal-section-title">📱 단말기 비용</div>
                <div class="modal-row">
                    <span class="modal-row-label">자급제 구매가</span>
                    <span class="modal-row-value">${this.formatNumber(selfPurchasePrice)}원</span>
                </div>
            </div>

            <div class="modal-section">
                <div class="modal-section-title">📶 알뜰폰 요금제 (${totalPeriod}개월)</div>
                <div class="modal-row">
                    <span class="modal-row-label">알뜰폰 요금</span>
                    <span class="modal-row-value">${this.formatNumber(planTotal)}원<span class="modal-row-calc">${this.formatNumber(mvnoPlanCost)}원×${totalPeriod}</span></span>
                </div>
                <div class="modal-row">
                    <span class="modal-row-label">유심비</span>
                    <span class="modal-row-value">${this.formatNumber(usimCost)}원</span>
                </div>
            </div>

            <div class="modal-section">
                <div class="modal-section-title">✅ 장점</div>
                <div class="modal-row">
                    <span class="modal-row-label">약정 없음</span>
                    <span class="modal-row-value">자유롭게 변경 가능</span>
                </div>
                <div class="modal-row">
                    <span class="modal-row-label">위약금</span>
                    <span class="modal-row-value">없음</span>
                </div>
            </div>
        `;

        return { html, total, monthly: total / totalPeriod };
    }
}

// 전역 변수로 저장
let calculator;

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    calculator = new Calculator();
    
    // 광고 슬롯이 비어있을 때 공백 제거
    setupAdSlotCleanup();

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            calculator.closeModal();
        }
    });
    
    // 모달 외부 클릭 시 닫기
    document.getElementById('detailModal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            calculator.closeModal();
        }
    });
});

function setupAdSlotCleanup() {
    const adSlots = document.querySelectorAll('.adsbygoogle');
    if (!adSlots.length) {
        return;
    }

    const hideIfUnfilled = (slot) => {
        const status = slot.getAttribute('data-ad-status');
        const rect = slot.getBoundingClientRect();
        const isUnfilled = status === 'unfilled' || rect.height < 30;
        if (isUnfilled) {
            const wrapper = slot.closest('.ad-section');
            if (wrapper) {
                wrapper.style.display = 'none';
            }
        }
    };

    adSlots.forEach((slot) => {
        // 상태 변화 감지
        const observer = new MutationObserver(() => hideIfUnfilled(slot));
        observer.observe(slot, { attributes: true, attributeFilter: ['data-ad-status'] });

        // 초기/지연 체크
        hideIfUnfilled(slot);
        setTimeout(() => hideIfUnfilled(slot), 2000);
        setTimeout(() => hideIfUnfilled(slot), 5000);
    });
}
