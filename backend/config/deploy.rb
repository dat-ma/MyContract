# frozen_string_literal: true

# TODO: Refactor
require 'bundler/setup'
require 'yaml'
require 'active_support/all'

settings = YAML.load_file('config/deploy.yml')

default_settings = ActiveSupport::HashWithIndifferentAccess.new(settings['default'] || {})
stage_settings = ActiveSupport::HashWithIndifferentAccess.new(settings[fetch(:stage).to_s] || {})

settings = default_settings.merge(stage_settings)

# config valid for current version and patch releases of Capistrano
lock '~> 3.18.1'

server settings[:server], user: settings[:user], roles: %w[all master]

set :application, settings[:application]
set :repo_url, settings[:repo_url]
set :submodules, settings[:submodules]

if settings[:branch]&.downcase == 'head'
  set :branch, -> { `git rev-parse --abbrev-ref HEAD`.chomp }
else
  set :branch, settings[:branch] || -> { `git rev-parse --abbrev-ref HEAD`.chomp }
end

set :deploy_to, "/home/#{settings[:user]}/workspace/#{fetch(:stage)}/#{fetch(:application)}"

# Default value for :format is :airbrussh.
set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
set :format_options, command_output: true, log_file: 'log/capistrano.log', color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

append :linked_files, '.env.production.local', 'docker-compose.yml', *settings[:files]

append :linked_dirs, 'tmp/redis-data', 'tmp/postgresql-data', *settings[:dirs]

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

set :keep_releases, 5

set :ssh_options, {
  forward_agent: false,
  auth_methods: %w[publickey]
}

set :docker_network, settings[:docker_network]
set :docker_main_service, settings[:docker_master_service]
