type TelegramMessage = {
  reference: string;
  fullName: string;
  loanType: string;
  amount: number;
  repaymentMonths: number;
};

export async function sendLoanApplicationNotification({
  reference,
  fullName,
  loanType,
  amount,
  repaymentMonths,
}: TelegramMessage) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram notification skipped: missing configuration.");
    return;
  }

  const formatter = new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 0,
  });

  const text = [
    "New Loan Application",
    "",
    `Reference: ${reference}`,
    `Applicant: ${fullName}`,
    `Product: ${loanType}`,
    `Amount: ${formatter.format(amount)}`,
    `Repayment: ${repaymentMonths} months`,
    "",
    "Open Admin Dashboard to review.",
  ].join("\n");

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Failed to send Telegram notification: ${detail}`);
  }
}
