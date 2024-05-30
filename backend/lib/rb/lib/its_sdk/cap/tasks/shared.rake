# frozen_string_literal: true

namespace :deploy do
  namespace :create do
    task :linked_files do
      on roles(:all) do
        within shared_path do
          fetch(:linked_files).each do |file|
            execute(:touch, file)
          end
        end
      end
    end
  end
end
