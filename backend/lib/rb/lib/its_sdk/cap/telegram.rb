# frozen_string_literal: true

require_relative "helper"

ItsSdk::Cap::Helper.load_plugin "notify", "git"

namespace :deploy do
  namespace :notify do
    task :telegram_success do
      next unless fetch(:telegram_enabled)

      set :telegram_columns, lambda {
        if fetch(:public_links).empty?
          <<~COLUMNS
            |W| full |W| Project      |W| #{fetch(:application)}/#{fetch(:stage)}
            |W| full |W| Status       |W| Succeed
            |W| full |W| Build        |W| #{fetch(:git_sha)}
            |W| full |W| Changelog    |W| #{fetch(:git_changelog)}
          COLUMNS
        else
          <<~COLUMNS
            |W| full |W| Project      |W| #{fetch(:application)}/#{fetch(:stage)}
            |W| full |W| Status       |W| Succeed
            |W| full |W| Build        |W| #{fetch(:git_sha)}
            |W| full |W| Links        |W| #{fetch(:public_links).join("\n")}
            |W| full |W| Changelog    |W| #{fetch(:git_changelog)}
          COLUMNS
        end
      }

      set :telegram_message, "✅ #{fetch(:application)}/#{fetch(:stage)} build successfully"

      invoke! :"deploy:notify:telegram"
    end

    task :telegram_failure do
      next unless fetch(:telegram_enabled)

      set :telegram_columns, lambda {
        <<~COLUMNS
          |W| full |W| Project    |W| #{fetch(:application)}/#{fetch(:stage)}
          |W| full |W| Status     |W| Failed
          |W| full |W| Build      |W| #{fetch(:git_sha)}
          |W| full |W| Changelog  |W| #{fetch(:git_changelog)}
        COLUMNS
      }
      set :telegram_message, "❌ #{fetch(:application)}/#{fetch(:stage)} build is failed"

      invoke! :"deploy:notify:telegram"
    end
  end
end

namespace :load do
  task :defaults do
    set :public_links, []
    set :telegram_enabled, true
  end
end

after :"deploy:finished", :"deploy:notify:telegram_success"
after :"deploy:failed", :"deploy:notify:telegram_failure"
