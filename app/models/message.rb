class Message < ApplicationRecord
  belongs_to :user
  belongs_to :room
  after_create_commit { broadcast_append_to room }
  after_create_commit :notify_recipient
  before_create :confirm_participant

  def confirm_participant
    return unless room.is_private

    is_participant = Participant.where(user_id: self.user.id, room_id: self.room.id).first
    throw :abort unless is_participant
  end

  private

  def notify_recipient
    if room.is_private
      participant = Participant.where(room_id: self.room.id).where.not(user_id: self.user.id).first
      recipient = User.find(participant.user_id)
      if recipient.status == 'offline'
        MessageNotification.with(message: self).deliver_later(recipient)
      end
    end
  end
end