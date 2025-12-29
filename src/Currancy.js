const Currency = (ruppes) => {
  if (ruppes === null || ruppes === undefined || ruppes === '') return '₹ 0.00'

  const amount = Number(ruppes)

  if (isNaN(amount)) return '₹ 0.00'

  return `₹ ${amount.toFixed(2)}`
}

export default Currency
