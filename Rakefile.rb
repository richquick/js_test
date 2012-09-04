require 'rubygems'
require 'mail'

class String
  def starts_with?(characters)
      self.match(/^#{Regexp.escape(characters)}/) ? true : false
  end
  def ends_with?(characters)
      self.match(/#{Regexp.escape(characters)}$/) ? true : false
  end
end

task :default do
  puts "Please choose a Rake command first:\n\n"
  puts `rake -T`
end

namespace :ac do

  File.exist?('/a/path/which/only/exists/on/the/live/server') ? server = 'live' : server = 'dev'
  
  desc "Pull down files from Github"
  task :pull do
    git_path = `which git`.delete("\n")
    server == 'dev' ? branch = 'dev' : branch = 'master'
    cmd = "sh -c \"cd /github/ && #{git_path} pull origin #{branch}\""
    puts "Try a Git pull:"
    fail unless system cmd
  end

  desc "Move all files from the github directory to the right location"
  task :move => [:tests] do
    nomedia_files = {}
    if server == 'live'  
      from_path = '/github/'
      to_path = '/var/www/html/'
    elsif server == 'dev'
      from_path = '/Users/rich/Documents/github/js_test/'
      to_path = '/Users/rich/var/www/html/'
    end
    
    to_move = {
	  'app/' => ''
    }
 
    to_move.each do |key,val|
      cmd = "sh -c \"yes | cp -r #{from_path}#{key} #{to_path}#{val}\""
      puts "Trying to move everything in #{from_path}#{key} to #{to_path}#{val}"
      fail unless system cmd
      puts "Success!"
    end
  end
  
  desc "Pull files from Github and move them to the correct location"
  task :pull_and_move => [:pull, :move] do
  end
  
  desc "Run Jasmine unit tests"
  task :tests do
    jasmine_file = 'phantom_jasmine.js'
    path_to_specs = '/Users/rich/Documents/github/js_test/spec/spec_runner.html'
    test_results = `phantomjs #{jasmine_file} file://localhost#{path_to_specs}`
    
    if test_results.include? 'alert_has_passed'
      puts 'Success! No failed tests'
    else
      puts 'Boo! Some tests failed:'
      test_results = test_results.gsub('LINE_END',"\n\n")
      puts test_results
      
      if server == 'dev'
	      email_domain = '@speaktorich.com'
	#       email_people = [
	#         'richard.quick',
	#         'bruce.wayne',
	#         'peter.parker'
	#       ]
	      email_people = ['rich']
	      emails_list = []
	      email_people.each {|stem| emails_list << "#{stem}#{email_domain}"}
	      
	      emails_list = emails_list.join ', '
	
	      mail = Mail.new do
	        from    'test.runner@arnoldclark.co.uk'
	        to   	emails_list
	        subject 'Possible JS Issue'
	        body    "Test Results were as follows:\n\n" + test_results
	      end
	      mail.delivery_method :sendmail
	      mail.deliver!
      end
      
      fail
    end
  end
  
  
end