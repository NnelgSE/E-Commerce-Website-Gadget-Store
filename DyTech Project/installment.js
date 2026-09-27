

(function () {
  // ---- Grab elements (based on the markup structure) ----
  const numberInputs = document.querySelectorAll('.calculator-inputs input[type="number"]');
  const priceInput = numberInputs[0];
  const downPaymentInput = numberInputs[1];
  const interestInput = numberInputs[2];
  const periodSelect = document.querySelector('.calculator-inputs select');
  const tabButtons = document.querySelectorAll('.calculator-tabs button');

  const detailRows = document.querySelectorAll('.payment-details .detail-row strong');
  const priceOut = detailRows[0];
  const downPaymentOut = detailRows[1];
  const financedOut = detailRows[2];
  const interestOut = detailRows[3];

  const totalOut = document.querySelector('.total-row strong');
  const mainAmountOut = document.querySelector('.main-payment strong');
  const mainCountOut = document.querySelector('.main-payment small');
  const mainLabelOut = document.querySelector('.main-payment span');
  const resultTitle = document.querySelector('.calculator-result h3');
  const checkoutBtn = document.querySelector('.calculator-button');

  let mode = 'monthly'; // 'monthly' | 'yearly'

  // ---- Helpers ----
  function currency(num) {
    const safe = Number.isFinite(num) ? num : 0;
    return '₱' + safe.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function getMonths() {
    const text = periodSelect.value || periodSelect.options[periodSelect.selectedIndex].text;
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 1;
  }

  // ---- Core calculation ----
  function calculate() {
    const price = parseFloat(priceInput.value) || 0;
    const downPayment = Math.min(parseFloat(downPaymentInput.value) || 0, price);
    const interestRate = parseFloat(interestInput.value) || 0;
    const months = Math.max(getMonths(), 1);

    const financed = Math.max(price - downPayment, 0);
    const interestAmount = financed * (interestRate / 100);
    const total = financed + interestAmount;

    let numPayments;
    let perPayment;
    let headingLabel;
    let badgeLabel;

    if (mode === 'yearly') {
      numPayments = Math.max(Math.round(months / 12), 1);
      perPayment = total / numPayments;
      headingLabel = 'Your Yearly Payment';
      badgeLabel = 'ESTIMATED YEARLY PAYMENT';
    } else {
      numPayments = months;
      perPayment = total / numPayments;
      headingLabel = 'Your Monthly Payment';
      badgeLabel = 'ESTIMATED MONTHLY PAYMENT';
    }

    const unitLabel = numPayments === 1 ? 'payment' : 'payments';

    // Update summary breakdown
    priceOut.textContent = currency(price);
    downPaymentOut.textContent = currency(downPayment);
    financedOut.textContent = currency(financed);
    interestOut.textContent = currency(interestAmount);
    totalOut.textContent = currency(total);

    // Update headline payment
    mainAmountOut.textContent = currency(perPayment);
    mainCountOut.textContent = `${numPayments} ${unitLabel}`;
    mainLabelOut.textContent = badgeLabel;
    resultTitle.textContent = headingLabel;
  }

  // ---- Tab switching (Monthly / Yearly) ----
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => {
        b.classList.remove('Btn-active');
        b.classList.add('Btn');
      });
      btn.classList.remove('Btn');
      btn.classList.add('Btn-active');

      mode = btn.textContent.trim().toLowerCase() === 'yearly' ? 'yearly' : 'monthly';
      calculate();
    });
  });

  // ---- Live recalculation on input changes ----
  [priceInput, downPaymentInput, interestInput].forEach((input) => {
    input.addEventListener('input', calculate);
  });
  periodSelect.addEventListener('change', calculate);

  // ---- Checkout button (placeholder action) ----
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      calculate();
      alert('Proceeding to checkout...');
    });
  }

  // ---- Initial render ----
  document.addEventListener('DOMContentLoaded', calculate);
  calculate();
})();