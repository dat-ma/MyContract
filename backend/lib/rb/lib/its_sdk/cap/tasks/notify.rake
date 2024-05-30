# frozen_string_literal: true

require "capistrano/doctor/output_helpers"
require "its_sdk/cap/ext/telegram"

namespace :deploy do
  namespace :notify do
    include Capistrano::Doctor::OutputHelpers

    task :telegram do
      run_locally do
        puts "Send message to group: #{fetch(:telegram_group)}, topic: #{fetch(:telegram_topic)}"
        puts <<~MESSAGE
          #{fetch(:telegram_message)}

          #{fetch(:telegram_columns)}
        MESSAGE
      end

      next if dry_run?

      run_locally do
        response = ItsSdk::Cap::Ext::Telegram.notify(
          group_id: fetch(:telegram_group),
          topic_id: fetch(:telegram_topic),
          token: fetch(:telegram_token),
          message: fetch(:telegram_message),
          columns: fetch(:telegram_columns)
        )

        warn "Failed to send message to telegram #{response.body}" unless response.ok?
      end
    end
  end
end

namespace :load do
  task :defaults do
    set :telegram_token, -> { ENV["TELEGRAM_TOKEN"] }
    set :telegram_message, ""
    set :telegram_columns, ""
    set :telegram_topic, nil
  end
end
