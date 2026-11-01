import echo from '@/echo'

// كل دالة تشترك في قناة وتعيد دالة إلغاء الاشتراك.
// الاسم يبدأ بنقطة لأن الحدث يستخدم broadcastAs() مخصصا:
// بدون النقطة يضيف Echo اسم namespace الكلاس ولا يطابق الحدث.

// صندوق وارد الفريق: كل الرسائل والتذاكر الجديدة وتحديثات الحالة
export function listenStaff({ onMessage, onTicketCreated, onTicketUpdated } = {}) {
  const ch = echo.private('support-staff')
  if (onMessage) ch.listen('.support.message.sent', onMessage)
  if (onTicketCreated) ch.listen('.support.ticket.created', onTicketCreated)
  if (onTicketUpdated) ch.listen('.support.ticket.updated', onTicketUpdated)
  return () => echo.leave('support-staff')
}

// محادثة تذكرة واحدة مفتوحة (للفريق والعميل)
export function listenTicket(ticketId, { onMessage, onTicketUpdated } = {}) {
  const name = `support.ticket.${ticketId}`
  const ch = echo.private(name)
  if (onMessage) ch.listen('.support.message.sent', onMessage)
  if (onTicketUpdated) ch.listen('.support.ticket.updated', onTicketUpdated)
  return () => echo.leave(name)
}

// قناة المستخدم الشخصية: تذكرة جديدة أو تحديث على أي تذكرة من تذاكره
export function listenUser(userId, { onTicketCreated, onTicketUpdated } = {}) {
  const name = `support.user.${userId}`
  const ch = echo.private(name)
  if (onTicketCreated) ch.listen('.support.ticket.created', onTicketCreated)
  if (onTicketUpdated) ch.listen('.support.ticket.updated', onTicketUpdated)
  return () => echo.leave(name)
}
