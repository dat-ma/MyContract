# frozen_string_literal: true

require_relative "lib/its_sdk/version"

Gem::Specification.new do |spec|
  spec.name = "its_sdk"
  spec.version = ItsSdk::VERSION
  spec.authors = ["BichLS"]
  spec.email = ["bich.le@icetea.io"]

  spec.summary = "Capistrano workflows"
  spec.description = "Capistrano workflows"
  spec.homepage = "https://github.com/IceteaSoftware/sdk"
  spec.license = "MIT"
  spec.required_ruby_version = ">= 2.6.0"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/IceteaSoftware/sdk"
  spec.metadata["changelog_uri"] = "https://github.com/IceteaSoftware/sdk/blob/main/CHANGELOG.md"

  spec.files = Dir.chdir(__dir__) do
    `git ls-files -z`.split("\x0").reject do |f|
      (f == __FILE__) || f.match(%r{\A(?:(?:bin|test|spec|features)/|\.(?:git|circleci)|appveyor)})
    end
  end
  spec.bindir = "exe"
  spec.executables = spec.files.grep(%r{\Aexe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_dependency "activesupport"
  spec.add_dependency "capistrano"
  spec.add_dependency "capistrano-file-permissions"
  spec.add_dependency "capistrano-git-with-submodules"
  spec.add_dependency "httparty"
end
