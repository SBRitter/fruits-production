import web

urls = (
	'/extremes', 'extremes',
	'/training', 'training',
	'/trials', 'trials'
)

class extremes:
  def GET(self):
	web.header('Access-Control-Allow-Origin', '*')
	web.header('Access-Control-Allow-Credentials', 'true')
	web.header('Content-Type','text/plain; charset=utf-8', unique=True)
	my_fruits = self.get_list()
	return my_fruits

  def get_list(self):
	with open("../data/extreme_list.csv", "rU") as content_file:
		content = content_file.read()
		return content

class training:
	def GET(self):
		web.header('Access-Control-Allow-Origin', '*')
		web.header('Access-Control-Allow-Credentials', 'true')
		web.header('Content-Type','text/plain; charset=utf-8', unique=True)
		my_fruits = self.get_list()
		return my_fruits

	def get_list(self):
		with open("../data/training.csv", "rU") as content_file:
			content = content_file.read()
		return content

class trials:
	def GET(self):
		web.header('Access-Control-Allow-Origin', '*')
		web.header('Access-Control-Allow-Credentials', 'true')
		web.header('Content-Type','text/plain; charset=utf-8', unique=True)
		my_fruits = self.get_list()
		return my_fruits

	def get_list(self):
		with open("../data/trial_list.csv", "rU") as content_file:
			content = content_file.read()
		return content

if __name__ == "__main__":
	app = web.application(urls, globals())
	app.run()
