# frozen_string_literal: true

def docker_compose(*args)
  execute(:docker, "compose", "--project-name", fetch(:application), *args)
end

namespace :deploy do
  namespace :docker do
    namespace :network do
      task :create do
        on roles(:all) do
          execute(:docker, "network", "create", fetch(:docker_network), verbosity: :DEBUG)
        rescue StandardError
          nil
        end
      end
    end

    task :build do
      on roles(:all) do
        within current_path do
          docker_compose "build"
        end
      end
    end

    task :update do
      on roles(:all) do
        within current_path do
          docker_compose "up", "--detach"
        end
      end
    end

    task :cleanup do
      on roles(:all) do
        if fetch(:docker_skip_clean)
          info "Skip clean docker system"
        else
          execute :docker, "system", "prune", "--force", "--all"
        end
      end
    end

    task :restart do
      on roles(:all) do
        within current_path do
          docker_compose "up", "--detach", "--force-recreate"
        end
      end
    end

    namespace :adonis do
      task :migrate do
        on roles(:master) do
          within current_path do
            docker_compose "run", "--rm", fetch(:docker_main_service), "node", "ace", "migration:run", "--force"
          end
        end
      end

      task :reset do
        on roles(:master) do
          within current_path do
            docker_compose "run", "--rm", fetch(:docker_main_service), "node", "ace", "migration:fresh"
          end
        end
      end
    end
  end
end

namespace :load do
  task :defaults do
    set :docker_network, -> { fetch(:application) }
    set :docker_main_service, :backend
    set :docker_skip_clean, false
  end
end
