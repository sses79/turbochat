# To deliver this notification:
#
# MessageNotification.with(post: @post).deliver_later(current_user)
# MessageNotification.with(post: @post).deliver(current_user)

class MessageNotification < Noticed::Base
  # Add your delivery methods
  #
  deliver_by :database
  # deliver_by :email, mailer: "UserMailer"
  # deliver_by :slack
  # deliver_by :custom, class: "MyDeliveryMethod"

  # Add required params
  #
  param :message

  # Define helper methods to make rendering easier.
  #
  def message
    message = params[:message]
    t(".message", email: message.user.email, body: message.body, time: message.created_at)
  end
  #
  # def url
  #   post_path(params[:post])
  # end
end
